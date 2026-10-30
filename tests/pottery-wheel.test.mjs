import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';

const page = fs.readFileSync(new URL('../src/pages/programs/pottery-wheel.astro', import.meta.url), 'utf8');
const script = page.match(/<script is:inline>([\s\S]*?)<\/script>/)[1];
const flush = () => new Promise(resolve => setImmediate(resolve));

async function setup(search = '', options = {}) {
  const elements = new Map();
  const element = selector => {
    if (!elements.has(selector)) elements.set(selector, {
      dataset: {}, handlers: {}, checked: true, value: '',
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
  element('[name="email"]').value = 'test@example.test';
  const requests = [];
  let destination;
  vm.runInNewContext(script, {
    document: { querySelector: element, querySelectorAll: () => [cohort], title: 'Pottery Wheel' },
    URL, URLSearchParams,
    location: { search, href: 'https://sparkpreneurs.ca/programs/pottery-wheel/' + search, assign(url) { destination = url; } },
    history: { replaceState() {} },
    FormData: class { get(name) { return { firstName: 'Test', lastName: 'Participant', email: element('[name="email"]').value, phone: '4165550100', experienceLevel: 'Beginner', consent: 'yes' }[name]; } },
    fetch: async (_, fetchOptions) => {
      const payload = JSON.parse(fetchOptions.body);
      requests.push(payload);
      const response = payload.action === 'ping'
        ? { programCode: payload.programCode, stripeMode: 'live', discountsSupported: options.discountsSupported === true }
        : payload.action === 'verifyCheckoutSession'
          ? { paymentStatus: 'paid' }
          : payload.action === 'quoteCheckout'
            ? await (options.quote || (() => ({ success: true, discountCode: payload.discountCode.toUpperCase(), subtotalCents: 25000, discountCents: 2500, taxCents: 0, expectedAmountCents: 22500 })))()
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

test('discount form is hidden until the deployed service supports discounts', async () => {
  const oldBackend = await setup();
  assert.equal(oldBackend.element('[data-pottery-discount]').hidden, true);
  const newBackend = await setup('', { discountsSupported: true });
  assert.equal(newBackend.element('[data-pottery-discount]').hidden, false);
});

test('applied server quote displays totals and sends code/email and trusted amount to checkout', async () => {
  const { element, requests, destination } = await setup('', { discountsSupported: true });
  element('[name="discountCode"]').value = 'kumon25';
  await element('[data-pottery-discount-apply]').handlers.click();
  assert.equal(element('[data-pottery-discount-summary]').hidden, false);
  assert.equal(element('[data-pottery-discount-total]').textContent, '$225.00');
  await element('[data-pottery-wheel-submit]').handlers.click();
  const payload = requests.find(request => request.action === 'createCheckoutSession');
  assert.equal(payload.discountCode, 'KUMON25');
  assert.equal(payload.displayedAmountCents, 22500);
  assert.equal(payload.email, 'test@example.test');
  assert.equal(destination(), 'https://checkout.stripe.com/test');
});

test('email changes invalidate the quote and require reviewing a new total before checkout', async () => {
  const { element, requests } = await setup('', { discountsSupported: true });
  element('[name="discountCode"]').value = 'KUMON25';
  await element('[data-pottery-discount-apply]').handlers.click();
  element('[name="email"]').value = 'other@example.test';
  element('[name="email"]').handlers.input();
  assert.equal(element('[data-pottery-discount-summary]').hidden, true);
  await element('[data-pottery-wheel-submit]').handlers.click();
  assert.equal(requests.filter(request => request.action === 'createCheckoutSession').length, 0);
  assert.equal(requests.filter(request => request.action === 'quoteCheckout').at(-1).email, 'other@example.test');
  await element('[data-pottery-wheel-submit]').handlers.click();
  assert.equal(requests.find(request => request.action === 'createCheckoutSession').email, 'other@example.test');
});

test('an already-used code displays the backend error without opening checkout', async () => {
  const { element, requests, destination } = await setup('', { discountsSupported: true,
    quote: () => ({ success: false, error: 'This discount code has already been used with this email.' }) });
  element('[name="discountCode"]').value = 'KUMON25';
  await element('[data-pottery-discount-apply]').handlers.click();
  assert.match(element('[data-pottery-wheel-status]').textContent, /already been used/);
  assert.equal(element('[data-pottery-discount-summary]').hidden, true);
  await element('[data-pottery-wheel-submit]').handlers.click();
  assert.equal(requests.filter(request => request.action === 'createCheckoutSession').length, 0);
  assert.equal(destination(), undefined);
});

test('a quote arriving after the code changes cannot be applied', async () => {
  let finish;
  const { element } = await setup('', { discountsSupported: true,
    quote: () => new Promise(resolve => { finish = resolve; }) });
  element('[name="discountCode"]').value = 'FIRST';
  const applying = element('[data-pottery-discount-apply]').handlers.click();
  element('[name="discountCode"]').value = 'SECOND';
  element('[name="discountCode"]').handlers.input();
  finish({ success: true, discountCode: 'FIRST', subtotalCents: 25000, discountCents: 2500, taxCents: 0, expectedAmountCents: 22500 });
  await applying;
  assert.equal(element('[data-pottery-discount-summary]').hidden, true);
  assert.match(element('[data-pottery-wheel-status]').textContent, /details changed/);
});
