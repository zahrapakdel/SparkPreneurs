import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';

const serviceSource = fs.readFileSync(new URL('../apps-script/DISCOUNT_SERVICE.gs', import.meta.url), 'utf8');
const clientSource = fs.readFileSync(new URL('../apps-script/shared/discount-client.js', import.meta.url), 'utf8');
const programs = ['AUGUST_SEPTEMBER_2026_POTTERY_WHEEL.gs', 'ADULT_HAND_POTTERY.gs', 'AUGUST_2026_3D_PRINTING.gs', 'AUGUST_SEPTEMBER_2026_ZUMBA.gs', 'AFTER_SCHOOL_PROGRAM.gs'];

class Sheet {
  constructor(name, values = []) { this.name = name; this.values = structuredClone(values); }
  getName() { return this.name; }
  getLastRow() { return this.values.length; }
  getLastColumn() { return this.values[0]?.length || 0; }
  getRange(row, column, rows = 1, columns = 1) { return {
    getValues: () => Array.from({ length: rows }, (_, i) => Array.from({ length: columns }, (_, j) => this.values[row - 1 + i]?.[column - 1 + j] ?? '')),
    setValues: values => values.forEach((line, i) => { this.values[row - 1 + i] ??= []; line.forEach((value, j) => { this.values[row - 1 + i][column - 1 + j] = value; }); }),
  }; }
  getDataRange() { return this.getRange(1, 1, this.getLastRow(), this.getLastColumn()); }
  appendRow(row) { this.values.push([...row]); }
  insertColumnsAfter(column, count) { this.values.forEach(row => row.splice(column, 0, ...Array(count).fill(''))); }
  setFrozenRows() {}
}

function setup() {
  const sheets = new Map();
  const workbook = { getSheetByName: name => sheets.get(name), insertSheet(name) { const sheet = new Sheet(name); sheets.set(name, sheet); return sheet; } };
  let next = 0, held = false, race = false;
  const sessions = new Map();
  const properties = { DISCOUNT_SPREADSHEET_ID: 'test', DISCOUNT_SERVICE_KEY: 'x'.repeat(40), STRIPE_MODE: 'test' };
  const context = vm.createContext({ console, Date,
    PropertiesService: { getScriptProperties: () => ({ getProperty: key => properties[key] }) },
    SpreadsheetApp: { openById: () => workbook, flush() {} },
    Utilities: { getUuid: () => 'token' + (++next) },
    ContentService: { MimeType: { JSON: 'json' }, createTextOutput: text => ({ setMimeType: () => JSON.parse(text) }) },
    LockService: { getScriptLock: () => ({ waitLock() { assert.equal(held, false); held = true; }, releaseLock() { held = false; } }) },
  });
  vm.runInContext(serviceSource, context);
  context.discountStripe_ = (method, endpoint, mode) => {
    assert.equal(held, true, 'shared lock covers Stripe checks and expiration');
    const session = sessions.get(endpoint.split('/')[3]);
    assert.ok(session);
    assert.equal(session.mode, mode);
    if (method === 'post') {
      if (race) { session.payment_status = 'paid'; session.status = 'complete'; throw new Error('Cannot expire completed session'); }
      session.status = 'expired';
    }
    return session;
  };
  context.setupDiscountWorkbook();
  const data = overrides => ({ action: 'quote', programCode: 'pottery_wheel', stripeMode: 'test', email: 'person@example.test', discountCode: 'KUMON25', ...overrides });
  const request = overrides => context.discountHandle_(data(overrides));
  const create = overrides => {
    const payload = data({ action: 'reserve', orderId: 'order' + (++next), expectedAmountCents: 22500, discountCents: 2500, ...overrides });
    const reservation = context.discountHandle_(payload);
    const id = 'cs_' + payload.stripeMode + '_session' + (++next);
    sessions.set(id, { id, mode: payload.stripeMode, livemode: payload.stripeMode === 'live', customer_email: payload.email.trim().toLowerCase(), status: 'open', payment_status: 'unpaid', currency: 'cad', amount_total: payload.expectedAmountCents,
      metadata: { programCode: payload.programCode, orderId: payload.orderId } });
    context.discountHandle_({ ...payload, action: 'attach', token: reservation.token, stripeSessionId: id });
    return id;
  };
  return { context, properties, sheets, sessions, data, request, create, racePayment: () => { race = true; } };
}

test('KUMON25 is $25, code/email matching ignores case and setup is additive', () => {
  const { context, request, sheets } = setup();
  assert.equal(request({ discountCode: ' Kumon25 ', email: ' PERSON@EXAMPLE.TEST ' }).discountCents, 2500);
  context.setupDiscountWorkbook();
  assert.equal(sheets.get('Discounts').getLastRow(), 2);
  assert.equal(sheets.get('Discount Usage').getLastRow(), 1, 'quotes do not reserve usage');
});

test('redemption in one program blocks all other programs, even without browser verification', () => {
  const { request, create, sessions, sheets } = setup();
  const id = create({ programCode: 'pottery_wheel' });
  sessions.get(id).payment_status = 'paid'; sessions.get(id).status = 'complete';
  assert.throws(() => request({ programCode: 'zumba', email: 'PERSON@example.test' }), /already been used/);
  assert.throws(() => create({ programCode: 'after_school_program' }), /already been used/);
  const usage = sheets.get('Discount Usage');
  assert.equal(usage.values[1][usage.values[0].indexOf('status')], 'PAID');
  assert.equal(usage.getLastRow(), 2);
});

test('paid confirmation is idempotent and another email remains eligible', () => {
  const { request, create, sessions, sheets } = setup();
  const id = create(); sessions.get(id).payment_status = 'paid';
  request({ action: 'confirm', stripeSessionId: id }); request({ action: 'confirm', stripeSessionId: id });
  assert.equal(sheets.get('Discount Usage').getLastRow(), 2);
  assert.equal(request({ email: 'other@example.test' }).discountCents, 2500);
  assert.throws(() => request(), /already been used/);
});

test('an unpaid cross-program replacement expires the old link under the central lock', () => {
  const { request, create, sessions } = setup();
  const first = create();
  assert.equal(request({ programCode: 'zumba' }).discountCents, 2500);
  const second = create({ programCode: 'zumba' });
  assert.equal(sessions.get(first).status, 'expired');
  assert.equal(sessions.get(second).status, 'open');
  assert.equal([...sessions.values()].filter(session => session.status === 'open').length, 1);
});

test('payment winning an expiration race blocks a replacement; unpaid processing also blocks', () => {
  const a = setup(); a.create(); a.racePayment();
  assert.throws(() => a.create({ programCode: 'zumba' }), /Cannot expire/);
  assert.equal(a.sessions.size, 1);
  const b = setup(); const id = b.create(); b.sessions.get(id).status = 'complete';
  assert.throws(() => b.create({ programCode: 'zumba' }), /still processing/);
});

test('unattached/uncertain reservation blocks competing checkouts; expired sessions allow reuse', () => {
  const a = setup(); a.request({ action: 'reserve', orderId: 'unknown', expectedAmountCents: 22500, discountCents: 2500 });
  assert.throws(() => a.create({ programCode: 'zumba' }), /needs review/);
  const b = setup(); const id = b.create(); b.sessions.get(id).status = 'expired';
  assert.ok(b.create({ programCode: 'zumba' }));
});

test('test-mode usage does not consume live eligibility', () => {
  const { create, request, sessions } = setup();
  const id = create(); sessions.get(id).payment_status = 'paid';
  assert.equal(request({ stripeMode: 'live' }).discountCents, 2500);
});

test('invalid, disabled, duplicate or expired codes cannot reserve a discount', () => {
  for (const row of [['OTHER', 2500, true, ''], ['KUMON25', 2500, false, ''], ['KUMON25', 2500, true, '2020-01-01T00:00:00Z'], ['KUMON25', -1, true, '']]) {
    const { sheets, request } = setup(); sheets.get('Discounts').values[1] = row;
    assert.throws(() => request());
    assert.equal(sheets.get('Discount Usage').getLastRow(), 1);
  }
  const { sheets, request } = setup(); sheets.get('Discounts').appendRow(['kumon25', 2500, true, '']);
  assert.throws(() => request(), /invalid or inactive/);
});

test('internal requests require the private service credential; metadata and amounts are checked', () => {
  const { context, request, create, sessions } = setup();
  assert.equal(context.doPost({ postData: { contents: JSON.stringify({ action: 'quote' }) } }).success, false);
  const id = create(); sessions.get(id).amount_total = 1;
  assert.throws(() => request(), /does not match/);
});

test('formula-like emails are stored safely without bypassing matching', () => {
  const { create, sessions, request, sheets } = setup();
  const id = create({ email: '+person@example.test' }); sessions.get(id).payment_status = 'paid';
  const usage = sheets.get('Discount Usage');
  assert.equal(usage.values[1][usage.values[0].indexOf('email')], "'+person@example.test");
  assert.throws(() => request({ email: '+PERSON@EXAMPLE.TEST' }), /already been used/);
});

test('every program embeds the same client, recalculates discounted tax and reserves/attaches checkout', () => {
  for (const file of programs) {
    const source = fs.readFileSync(new URL('../apps-script/' + file, import.meta.url), 'utf8');
    assert.equal(source.split('// BEGIN SHARED DISCOUNT CLIENT\n')[1], clientSource, file);
    assert.match(source, /discountReservePricing_\(pricing, orderId\)/);
    assert.match(source, /discountAttachSession_\(pricing, orderId,/);
    assert.match(source, /action === "quoteCheckout"/);
    assert.match(source, /discountsSupported: discountServiceConfigured_\(\)/);
    const context = vm.createContext({ console }); vm.runInContext(source, context);
    context.discountServiceRequest_ = () => ({ discountCents: 2500 });
    const pricing = context.discountApplyPricing_({ parentEmail: 'person@example.test', discountCode: 'kumon25' },
      { subtotalCents: 25000, taxCents: 3250, totalCents: 28250, items: [{ totalCents: 28250 }] }, 13);
    assert.equal(pricing.totalCents, 25425, file);
    assert.equal(pricing.items[0].totalCents, 25425, 'After School Stripe line item agrees');
    assert.throws(() => context.discountApplyPricing_({ email: 'test@example.test', discountCode: 'KUMON25' }, { subtotalCents: 2000 }, 0), /cannot be used/);
  }
});

test('Pottery Wheel header upgrade preserves existing paid data and is safe to rerun', () => {
  const source = fs.readFileSync(new URL('../apps-script/AUGUST_SEPTEMBER_2026_POTTERY_WHEEL.gs', import.meta.url), 'utf8');
  const context = vm.createContext({ console }); vm.runInContext(source, context);
  const headers = vm.runInContext('REGISTRATION_HEADERS', context);
  const original = headers.filter(header => !['discountCode', 'discountCents'].includes(header));
  const row = Array.from(original, header => header === 'parentEmail' ? 'existing@example.test' : header === 'stripePaymentStatus' ? 'paid' : '');
  const sheet = new Sheet('Registrations', [[...original], row]);
  context.appendDiscountHeaders_(sheet, headers); context.appendDiscountHeaders_(sheet, headers);
  assert.equal(sheet.values[1][sheet.values[0].indexOf('parentEmail')], 'existing@example.test');
  assert.equal(sheet.values[1][sheet.values[0].indexOf('stripePaymentStatus')], 'paid');
});
