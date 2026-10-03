import test from 'node:test';
import assert from 'node:assert/strict';
import vm from 'node:vm';
import fs from 'node:fs';

const page = fs.readFileSync(new URL('../src/pages/programs/3d-printing.astro', import.meta.url), 'utf8');
const script = page.match(/<script is:inline>([\s\S]*?)<\/script>/)[1];
const flush = () => new Promise(resolve => setImmediate(resolve));

async function setup(programs = ['august_2026_3d_printing']) {
  const elements = new Map();
  const element = selector => {
    if (!elements.has(selector)) elements.set(selector, {
      dataset: {}, hidden: false, disabled: false, attributes: {}, handlers: {},
      classList: { toggle() {} }, reportValidity: () => true,
      setAttribute(key, value) { this.attributes[key] = value; },
      addEventListener(event, handler) { this.handlers[event] = handler; },
    });
    return elements.get(selector);
  };
  const shop = element('[data-printing-registration]');
  shop.dataset = { endpoint: 'https://example.test/checkout', programCode: 'august_2026_3d_printing', itemCode: 'KIDS_3D_PRINTING_6_SESSION', price: '27000', returnUrl: 'https://sparkpreneurs.ca/programs/3d-printing/' };
  shop.querySelector = element;
  const requests = [];
  let destination;
  vm.runInNewContext(script, {
    document: { querySelector: element }, URL, URLSearchParams,
    FormData: class { get(name) { return { studentName: 'Test Child', parentName: 'Test Parent', parentEmail: 'test@example.test', phone: '4165550100' }[name]; } },
    location: { search: '', pathname: '/programs/3d-printing/', assign(url) { destination = url; } },
    fetch: async (_, options) => {
      const body = JSON.parse(options.body); requests.push(body);
      return { ok: true, text: async () => JSON.stringify(body.action === 'ping' ? { programs, stripeMode: 'live' } : { checkoutUrl: 'https://checkout.stripe.com/test' }) };
    },
  });
  await flush();
  return { element, requests, destination: () => destination };
}

test('cart adds, removes and clears the class, displaying totals only when selected', async () => {
  const { element } = await setup();
  const add = element('[data-printing-select]');
  const totals = element('[data-printing-totals]');
  const checkout = element('[data-printing-checkout]');
  assert.equal(totals.hidden, true);
  assert.equal(checkout.disabled, true);
  add.handlers.click();
  assert.equal(totals.hidden, false);
  assert.equal(element('[data-printing-empty]').hidden, true);
  assert.equal(checkout.disabled, false);
  element('[data-printing-remove]').handlers.click();
  assert.equal(totals.hidden, true);
  assert.equal(checkout.disabled, true);
  add.handlers.click();
  element('[data-printing-clear]').handlers.click();
  assert.equal(element('[data-printing-item]').hidden, true);
  assert.equal(add.textContent, 'Add to Cart');
});

test('checkout stays disabled when the backend does not offer this program', async () => {
  const { element } = await setup(['other-program']);
  element('[data-printing-select]').handlers.click();
  assert.equal(element('[data-printing-checkout]').disabled, true);
});

test('checkout submits the selected class and $270 total, locking selection while pending', async () => {
  const { element, requests, destination } = await setup();
  element('[data-printing-select]').handlers.click();
  await element('[data-printing-checkout]').handlers.click();
  const payload = requests.find(request => request.action === 'createCheckoutSession');
  assert.equal(payload.displayedAmountCents, 27000);
  assert.deepEqual(payload.selectedItemCodes, ['KIDS_3D_PRINTING_6_SESSION']);
  assert.equal(payload.parentEmail, 'test@example.test');
  assert.equal(element('[data-printing-select]').disabled, true);
  assert.equal(element('[data-printing-remove]').disabled, true);
  assert.equal(destination(), 'https://checkout.stripe.com/test');
});
