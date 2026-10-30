// Run after npm run build. All Google/Stripe requests are intercepted.
// PLAYWRIGHT_MODULE_PATH can point to a temporary Playwright installation.
import assert from 'node:assert/strict';
import { createServer } from 'node:http';
import { readFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { pathToFileURL } from 'node:url';

const playwrightModule = process.env.PLAYWRIGHT_MODULE_PATH
  ? pathToFileURL(process.env.PLAYWRIGHT_MODULE_PATH).href : 'playwright';
const { chromium } = await import(playwrightModule);
const root = path.resolve('dist');
const server = createServer(async (request, response) => {
  try {
    const pathname = decodeURIComponent(new URL(request.url, 'http://localhost').pathname);
    const file = path.resolve(root, '.' + pathname, ...(pathname.endsWith('/') ? ['index.html'] : []));
    if (!file.startsWith(root + path.sep)) { response.writeHead(403).end(); return; }
    const mime = { '.html': 'text/html', '.css': 'text/css', '.js': 'text/javascript', '.png': 'image/png', '.jpg': 'image/jpeg' };
    response.writeHead(200, { 'Content-Type': mime[path.extname(file)] || 'application/octet-stream' });
    response.end(await readFile(file));
  } catch { response.writeHead(404).end(); }
});
await new Promise(resolve => server.listen(0, '127.0.0.1', resolve));
let browser;
try {
  browser = await chromium.launch({ channel: process.env.BROWSER_CHANNEL || (process.platform === 'win32' ? 'msedge' : undefined), headless: true });
  for (const viewport of [{ width: 1440, height: 1000 }, { width: 390, height: 844 }]) {
    const context = await browser.newContext({ viewport });
    await context.addInitScript(() => sessionStorage.setItem('sparkpreneurs-featured-offers-v1', 'dismissed'));
    const page = await context.newPage();
    const errors = [];
    const requests = [];
    page.on('pageerror', error => errors.push(error.message));
    await page.route('https://fonts.googleapis.com/**', route => route.fulfill({ contentType: 'text/css', body: '' }));
    await page.route('https://script.google.com/**', async route => {
      const data = route.request().postDataJSON();
      requests.push(data);
      const body = data.action === 'ping'
        ? { success: true, programCode: data.programCode, stripeMode: 'live', discountsSupported: true }
        : data.action === 'quoteCheckout'
          ? data.email.trim().toLowerCase() === 'used@example.test'
            ? { success: false, error: 'This discount code has already been used with this email.' }
            : { success: true, discountCode: 'KUMON25', subtotalCents: 25000, discountCents: 2500, taxCents: 0, expectedAmountCents: 22500 }
          : { success: true, checkoutUrl: 'https://checkout.stripe.com/c/pay/mock' };
      await route.fulfill({ contentType: 'application/json', headers: { 'Access-Control-Allow-Origin': '*' }, body: JSON.stringify(body) });
    });
    await page.route('https://checkout.stripe.com/**', route => route.fulfill({ contentType: 'text/html', body: '<h1>Mock Stripe checkout</h1>' }));
    await page.goto(`http://127.0.0.1:${server.address().port}/programs/pottery-wheel/`);
    await page.locator('[data-pottery-wheel-cohort-card]').first().click();
    await page.locator('[name="firstName"]').fill('Test');
    await page.locator('[name="lastName"]').fill('Participant');
    await page.locator('[name="email"]').fill('test@example.test');
    await page.locator('[name="phone"]').fill('4165550100');
    await page.locator('[name="experienceLevel"]').selectOption('beginner');
    await page.locator('[name="consent"]').check();
    await page.locator('[data-pottery-discount]').waitFor({ state: 'visible' });
    await page.locator('[name="discountCode"]').fill('kumon25');
    await page.locator('[data-pottery-discount-apply]').click();
    await page.waitForFunction(() => document.querySelector('[data-pottery-discount-total]').textContent === '$225.00');
    assert.equal(await page.locator('[data-pottery-discount-summary]').isVisible(), true);
    assert.equal(await page.evaluate(() => document.documentElement.scrollWidth > window.innerWidth), false, 'no horizontal overflow');
    const screenshot = path.join(tmpdir(), `sparkpreneurs-discount-${viewport.width}.png`);
    await page.locator('[data-pottery-wheel-registration]').screenshot({ path: screenshot });
    console.log('Screenshot: ' + screenshot);
    await page.locator('[name="email"]').fill('used@example.test');
    await page.waitForFunction(() => document.querySelector('[data-pottery-discount-summary]').hidden);
    assert.equal(await page.locator('[data-pottery-discount-summary]').isVisible(), false,
      JSON.stringify(await page.locator('[data-pottery-discount-summary]').evaluate(node => ({ hidden: node.hidden, display: getComputedStyle(node).display }))));
    await page.locator('[data-pottery-discount-apply]').click();
    await page.waitForFunction(() => document.querySelector('[data-pottery-wheel-status]').textContent.includes('already been used'));
    assert.equal(requests.filter(request => request.action === 'createCheckoutSession').length, 0);
    await page.locator('[name="email"]').fill('another@example.test');
    await page.locator('[data-pottery-discount-apply]').click();
    await page.waitForFunction(() => !document.querySelector('[data-pottery-discount-summary]').hidden);
    await page.locator('[data-pottery-wheel-submit]').click();
    await page.waitForURL('https://checkout.stripe.com/**');
    const checkout = requests.find(request => request.action === 'createCheckoutSession');
    assert.equal(checkout.discountCode, 'KUMON25');
    assert.equal(checkout.email, 'another@example.test');
    assert.equal(checkout.displayedAmountCents, 22500);
    assert.deepEqual(errors, []);
    console.log(`${viewport.width}px: discount, duplicate-email error, revised email, checkout and layout OK`);
    await context.close();
  }
  const programs = [
    { route: '/programs/3d-printing/', add: '[data-printing-select]', submit: '[data-printing-checkout]' },
    { route: '/programs/hand-building-pottery/', add: '[data-course-add]', submit: '[data-course-purchase]' },
    { route: '/programs/zumba/', add: '[data-zumba-add]', submit: '[data-zumba-checkout]' },
    { route: '/after-school/', add: '[data-select-plan]', submit: '[data-checkout]' },
  ];
  for (const viewport of [{ width: 1440, height: 1000 }, { width: 390, height: 844 }]) {
    for (const program of programs) {
      const context = await browser.newContext({ viewport });
      await context.addInitScript(() => sessionStorage.setItem('sparkpreneurs-featured-offers-v1', 'dismissed'));
      const page = await context.newPage();
      const errors = [], requests = [];
      page.on('pageerror', error => errors.push(error.message));
      await page.route('https://fonts.googleapis.com/**', route => route.fulfill({ contentType: 'text/css', body: '' }));
      await page.route('https://script.google.com/**', async route => {
        const data = route.request().postDataJSON(); requests.push(data);
        const code = data.programCode || (program.route.includes('hand-building') ? 'adult_hand_building_pottery' : 'after_school_program');
        const body = data.action === 'ping'
          ? { success: true, version: 'test', programCode: code, programs: [code], stripeMode: 'live', discountsSupported: true, bookingVersion: 1 }
          : data.action === 'getBookingCalendar'
            ? { success: true, firstWeek: '2026-01-05', lastWeek: '2099-12-28', closedWeeks: [] }
            : data.action === 'verifyCheckoutSession'
              ? { success: true, paid: true, paymentStatus: 'paid' }
            : data.action === 'quoteCheckout'
              ? data.email === 'used@example.test'
                ? { success: false, error: 'This discount code has already been used with this email.' }
                : { success: true, discountCode: 'KUMON25', subtotalCents: 25000, discountCents: 2500, taxCents: 0, expectedAmountCents: 22500 }
              : { success: true, checkoutUrl: 'https://checkout.stripe.com/c/pay/mock' };
        await route.fulfill({ contentType: 'application/json', headers: { 'Access-Control-Allow-Origin': '*' }, body: JSON.stringify(body) });
      });
      await page.route('https://checkout.stripe.com/**', route => route.fulfill({ contentType: 'text/html', body: '<h1>Mock Stripe checkout</h1>' }));
      await page.goto(`http://127.0.0.1:${server.address().port}${program.route}`);
      await page.locator(program.add).first().click();
      if (program.route === '/after-school/') {
        await page.locator('[data-start-date]').fill(await page.locator('[data-start-date]').getAttribute('min'));
        await page.locator('[data-week-count]').fill('4');
        await page.locator('[data-next]').click();
      }
      await page.locator('[name="studentName"]').fill('Test Participant');
      await page.locator('[name="parentName"]').fill('Test Contact');
      await page.locator('[name="parentEmail"]').fill('used@example.test');
      await page.locator('[name="phone"]').fill('4165550100');
      await page.locator('[data-registration-discount]').waitFor({ state: 'visible' });
      await page.locator('[name="discountCode"]').fill('Kumon25');
      await page.locator('[data-discount-apply]').click();
      await page.waitForFunction(() => document.querySelector('[data-discount-status]').textContent.includes('already been used'));
      assert.equal(requests.filter(request => request.action === 'createCheckoutSession').length, 0);
      await page.locator('[name="parentEmail"]').fill('new@example.test');
      await page.locator('[data-discount-apply]').click();
      await page.waitForFunction(() => !document.querySelector('[data-discount-summary]').hidden);
      assert.equal(await page.locator('[data-discount-total]').textContent(), '$225.00');
      assert.equal(await page.evaluate(() => document.documentElement.scrollWidth > window.innerWidth), false, program.route + ' horizontal overflow');
      await page.locator(program.submit).click();
      await page.waitForURL('https://checkout.stripe.com/**');
      const checkout = requests.find(request => request.action === 'createCheckoutSession');
      assert.equal(checkout.discountCode, 'KUMON25');
      assert.equal(checkout.parentEmail, 'new@example.test');
      assert.equal(checkout.displayedAmountCents, 22500);
      await page.goto(`http://127.0.0.1:${server.address().port}${program.route}?payment=success&session_id=cs_live_mock`);
      await page.waitForFunction(() => [...document.querySelectorAll('[data-status], [data-course-status], [data-zumba-status], [data-printing-status]')].some(element => element.dataset.type === 'success' || element.dataset.status === 'success'));
      assert.ok(requests.some(request => request.action === 'verifyCheckoutSession'));
      assert.deepEqual(errors, [], program.route);
      console.log(`${program.route} ${viewport.width}px: applied discount, reuse error, checkout and layout OK`);
      await context.close();
    }
  }
  for (const viewport of [{ width: 1440, height: 1000 }, { width: 390, height: 844 }]) {
    const context = await browser.newContext({ viewport });
    await context.addInitScript(() => sessionStorage.setItem('sparkpreneurs-featured-offers-v1', 'dismissed'));
    const page = await context.newPage();
    const requests = [], errors = [];
    page.on('pageerror', error => errors.push(error.message));
    await page.route('https://fonts.googleapis.com/**', route => route.fulfill({ contentType: 'text/css', body: '' }));
    await page.route('https://script.google.com/**', async route => {
      const data = route.request().postDataJSON(); requests.push(data);
      const body = data.action === 'ping'
        ? { success: true, programs: ['summer2026_4_10_sessions'] }
        : data.action === 'verifyCheckoutSession' ? { success: true, paymentStatus: 'paid' }
          : { success: true, checkoutUrl: 'https://checkout.stripe.com/c/pay/mock' };
      await route.fulfill({ contentType: 'application/json', headers: { 'Access-Control-Allow-Origin': '*' }, body: JSON.stringify(body) });
    });
    await page.route('https://checkout.stripe.com/**', route => route.fulfill({ contentType: 'text/html', body: '<h1>Mock Stripe checkout</h1>' }));
    const campUrl = `http://127.0.0.1:${server.address().port}/camps/summer-camp/`;
    await page.goto(campUrl);
    assert.equal(await page.locator('.is-ended [data-camp-session]').count(), 0);
    const poster = page.locator('[data-camp-week="07"] [data-camp-poster-toggle]');
    await poster.focus();
    await page.waitForFunction(() => document.querySelector('[data-camp-week="07"] [data-camp-poster-toggle]').getAttribute('aria-expanded') === 'true');
    await page.locator('[data-week="7"][data-session="FULL"]').click();
    await page.locator('[name="studentName"]').fill('Test Camper');
    await page.locator('[name="parentName"]').fill('Test Parent');
    await page.locator('[name="parentEmail"]').fill('camp@example.test');
    await page.locator('[name="phone"]').fill('4165550100');
    assert.equal(await page.locator('[data-camp-total]').textContent(), '$237.30');
    assert.equal(await page.evaluate(() => document.documentElement.scrollWidth > window.innerWidth), false, 'Camp horizontal overflow');
    await page.locator('[data-camp-checkout]').click();
    await page.waitForURL('https://checkout.stripe.com/**');
    const checkout = requests.find(data => data.action === 'createCheckoutSession');
    assert.deepEqual(checkout.selectedWeeks, ['W7AM', 'W7PM']);
    assert.equal(checkout.displayedAmountCents, 23730);
    await page.goto(campUrl + '?payment=success&session_id=cs_live_mock');
    await page.waitForFunction(() => document.querySelector('[data-camp-status]').dataset.status === 'success');
    assert.equal(requests.find(data => data.action === 'verifyCheckoutSession').stripeSessionId, 'cs_live_mock');
    assert.deepEqual(errors, []);
    console.log(`Summer Camp ${viewport.width}px: full-day checkout, backend verification and layout OK`);
    await context.close();
  }
} finally {
  if (browser) await browser.close();
  await new Promise(resolve => server.close(resolve));
}
