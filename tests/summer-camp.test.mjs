import test from 'node:test';
import assert from 'node:assert/strict';
import vm from 'node:vm';
import fs from 'node:fs';

const script = fs.readFileSync(new URL('../src/scripts/summer-camp-checkout.js', import.meta.url), 'utf8');
const flush = () => new Promise(resolve => setImmediate(resolve));

async function setup(options = {}) {
  const element = () => ({
    dataset: {}, attributes: {}, handlers: {}, children: [], disabled: false,
    addEventListener(event, handler) { this.handlers[event] = handler; },
    setAttribute(name, value) { this.attributes[name] = value; },
    append(...children) { this.children.push(...children); },
    replaceChildren(...children) { this.children = children; },
    scrollIntoView() {}, reportValidity: () => true,
  });
  const elements = new Map();
  const find = selector => {
    if (!elements.has(selector)) elements.set(selector, element());
    return elements.get(selector);
  };
  const buttons = [['7', 'AM', 10500], ['7', 'PM', 10500], ['7', 'FULL', 21000], ['8', 'AM', 10500]].map(([week, session, price]) => {
    const button = element();
    button.dataset = { week, session, price: String(price), name: `Week ${week} ${session}` };
    const label = element();
    button.querySelector = () => label;
    return button;
  });
  const inputs = [element(), element()];
  const form = find('[data-camp-form]');
  form.querySelectorAll = () => inputs;
  const shop = find('[data-camp-shop]');
  shop.dataset = { endpoint: 'https://example.test/camp', programCode: 'summer2026_4_10_sessions', returnUrl: 'https://sparkpreneurs.ca/summer-camp/' };
  shop.querySelector = find;
  shop.querySelectorAll = () => buttons;
  const requests = [];
  let destination, cleaned = false;
  const health = options.health || { success: true, programs: ['summer2026_4_10_sessions'] };
  vm.runInNewContext(script, {
    document: { querySelector: find, createElement: element }, URL, URLSearchParams, Intl,
    FormData: class { *[Symbol.iterator]() { yield* Object.entries({ studentName: 'Test Child', parentName: 'Test Parent', parentEmail: 'test@example.test', phone: '4165550100' }); } },
    location: { search: options.search || '', pathname: '/camps/summer-camp/', assign(url) { destination = url; } },
    history: { replaceState() { cleaned = true; } },
    fetch: async (_, request) => {
      const data = JSON.parse(request.body);
      requests.push(data);
      const response = data.action === 'ping' ? health : data.action === 'verifyCheckoutSession'
        ? { paymentStatus: options.paymentStatus || 'paid' } : await (options.checkout?.(data) || { checkoutUrl: 'https://checkout.stripe.com/c/pay/mock' });
      return { ok: true, text: async () => JSON.stringify(response) };
    },
  });
  await flush();
  const submit = () => form.handlers.submit({ preventDefault() {} });
  return { find, buttons, inputs, requests, submit, destination: () => destination, cleaned: () => cleaned };
}

test('legacy camp health enables checkout only for the supported program', async () => {
  for (const [health, enabled] of [
    [{ success: true, programs: ['summer2026_4_10_sessions'] }, true],
    [{ success: true, programCode: 'summer2026_4_10_sessions', stripeMode: 'live' }, true],
    [{ success: true, programs: ['another_program'] }, false],
    [{ success: false, programs: ['summer2026_4_10_sessions'] }, false],
    [{ success: true, programs: ['summer2026_4_10_sessions'], stripeMode: 'test' }, false],
  ]) {
    const app = await setup({ health });
    app.buttons[0].handlers.click();
    assert.equal(app.find('[data-camp-checkout]').disabled, !enabled);
    if (!enabled) { await app.submit(); assert.equal(app.requests.length, 1); }
  }
});

test('full day replaces a half day, expands into both backend products, and charges the reviewed total', async () => {
  const app = await setup();
  app.buttons[0].handlers.click();
  app.buttons[2].handlers.click();
  app.buttons[3].handlers.click();
  assert.equal(app.buttons[0].attributes['aria-pressed'], 'false');
  assert.equal(app.find('[data-camp-total]').textContent, '$355.95');
  await app.submit();
  const request = app.requests.find(data => data.action === 'createCheckoutSession');
  assert.deepEqual(request.selectedWeeks, ['W7AM', 'W7PM', 'W8AM']);
  assert.deepEqual(request.selectedWeekDetails.map(item => item.displayedPriceCents), [10500, 10500, 10500]);
  assert.equal(request.displayedAmountCents, 35595);
  assert.equal(request.parentEmail, 'test@example.test');
  assert.equal(request.successUrl, 'https://sparkpreneurs.ca/summer-camp/?payment=success&session_id={CHECKOUT_SESSION_ID}');
  assert.equal(app.destination(), 'https://checkout.stripe.com/c/pay/mock');
  assert.ok(app.inputs.every(input => input.disabled));
});

test('removing and clearing selections updates the cart and prevents empty checkout', async () => {
  const app = await setup();
  app.buttons[0].handlers.click();
  app.find('[data-camp-cart]').children[0].children[1].handlers.click();
  assert.equal(app.find('[data-camp-checkout]').disabled, true);
  app.buttons[2].handlers.click();
  app.find('[data-camp-clear]').handlers.click();
  await app.submit();
  assert.equal(app.find('[data-camp-totals]').hidden, true);
  assert.equal(app.requests.length, 1);
});

test('pending checkout blocks repeat submission and changes to the purchased sessions', async () => {
  let resolve;
  const pending = new Promise(done => { resolve = done; });
  const app = await setup({ checkout: () => pending });
  app.buttons[0].handlers.click();
  const submission = app.submit();
  await app.submit();
  app.buttons[2].handlers.click();
  app.find('[data-camp-clear]').handlers.click();
  assert.equal(app.buttons[0].attributes['aria-pressed'], 'true');
  assert.equal(app.requests.filter(data => data.action === 'createCheckoutSession').length, 1);
  resolve({ checkoutUrl: 'https://checkout.stripe.com/c/pay/mock' });
  await submission;
});

test('invalid checkout links and backend errors allow retry without redirecting', async () => {
  for (const response of [{ checkoutUrl: 'https://example.test/fake' }, { success: false, error: 'Class is full.' }]) {
    const app = await setup({ checkout: () => response });
    app.buttons[0].handlers.click();
    await app.submit();
    assert.equal(app.destination(), undefined);
    assert.equal(app.find('[data-camp-checkout]').disabled, false);
    assert.equal(app.find('[data-camp-status]').dataset.status, 'error');
  }
});

test('return verifies payment with the backend; unpaid results retain the session for retry', async () => {
  for (const paymentStatus of ['paid', 'unpaid']) {
    const app = await setup({ search: '?payment=success&session_id=cs_live_return', paymentStatus });
    const request = app.requests.find(data => data.action === 'verifyCheckoutSession');
    assert.equal(request.stripeSessionId, 'cs_live_return');
    assert.equal(app.find('[data-camp-status]').dataset.status, paymentStatus === 'paid' ? 'success' : 'error');
    assert.equal(app.cleaned(), paymentStatus === 'paid');
  }
});

test('cancellation never verifies a session or claims registration is paid', async () => {
  const app = await setup({ search: '?payment=canceled' });
  assert.equal(app.requests.length, 1);
  assert.equal(app.find('[data-camp-status]').dataset.status, 'warning');
  assert.equal(app.cleaned(), true);
});
