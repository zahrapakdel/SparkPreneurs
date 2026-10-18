import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';

const page = fs.readFileSync(new URL('../src/pages/programs/pottery-wheel.astro', import.meta.url), 'utf8');
const script = page.match(/<script is:inline>([\s\S]*?)<\/script>/)[1];
const flush = () => new Promise(resolve => setImmediate(resolve));

async function setup(search = '') {
  const elements = new Map();
  const element = selector => {
    if (!elements.has(selector)) elements.set(selector, {
      dataset: {}, handlers: {}, checked: true,
      addEventListener(event, handler) { this.handlers[event] = handler; },
      querySelector: element,
      closest: () => null,
      reportValidity: () => true,
      scrollIntoView() {},
    });
    return elements.get(selector);
  };
  element('[data-pottery-wheel-registration]').dataset = {
    appsScriptUrl: 'https://example.test/checkout',
    programCode: 'august_september_2026_pottery_wheel', requiredStripeMode: 'live',
  };
  const cohort = element('cohort');
  cohort.dataset = { itemCode: 'POTTERY_WHEEL_MON_EVENING', cohortLabel: 'Monday Evenings' };
  const requests = [];
  let destination;
  vm.runInNewContext(script, {
    document: { querySelector: element, querySelectorAll: () => [cohort], title: 'Pottery Wheel' },
    URL, URLSearchParams,
    location: { search, href: 'https://sparkpreneurs.ca/programs/pottery-wheel/' + search, assign(url) { destination = url; } },
    history: { replaceState() {} },
    FormData: class { get(name) { return { firstName: 'Test', lastName: 'Participant', email: 'test@example.test', phone: '4165550100', experienceLevel: 'Beginner', consent: 'yes' }[name]; } },
    fetch: async (_, options) => {
      const payload = JSON.parse(options.body);
      requests.push(payload);
      const response = payload.action === 'ping'
        ? { programCode: payload.programCode, stripeMode: 'live' }
        : payload.action === 'verifyCheckoutSession'
          ? { paymentStatus: 'paid' }
          : { checkoutUrl: 'https://checkout.stripe.com/test' };
      return { ok: true, text: async () => JSON.stringify(response) };
    },
  });
  await flush();
  return { element, requests, destination: () => destination };
}

test('checkout uses the legacy return route and opens Stripe', async () => {
  const { element, requests, destination } = await setup();
  await element('[data-pottery-wheel-submit]').handlers.click();
  const payload = requests.find(request => request.action === 'createCheckoutSession');
  assert.ok(payload);
  for (const value of [payload.successUrl, payload.cancelUrl]) {
    const url = new URL(value);
    assert.equal(url.origin, 'https://sparkpreneurs.ca');
    assert.equal(url.pathname, '/pottery-wheel/');
  }
  assert.equal(new URL(payload.successUrl).searchParams.get('session_id'), '{CHECKOUT_SESSION_ID}');
  assert.equal(destination(), 'https://checkout.stripe.com/test');
  const redirects = fs.readFileSync(new URL('../netlify.toml', import.meta.url), 'utf8');
  assert.match(redirects, /from = "\/pottery-wheel\/"\s+to = "\/programs\/pottery-wheel\/"/);
});

test('payment confirmation verifies the session after returning to the current route', async () => {
  const { element, requests } = await setup('?payment=success&session_id=cs_test_return');
  const verification = requests.find(request => request.action === 'verifyCheckoutSession');
  assert.equal(verification.stripeSessionId, 'cs_test_return');
  assert.equal(element('[data-pottery-wheel-status]').dataset.status, 'success');
});
