import test from 'node:test';
import assert from 'node:assert/strict';
import vm from 'node:vm';
import fs from 'node:fs';
import { bookingWeeks } from '../src/scripts/booking-weeks.js';

const source = fs.readFileSync(new URL('../apps-script/AFTER_SCHOOL_PROGRAM.gs', import.meta.url), 'utf8');
function backend() {
  const properties = { BOOKING_FIRST_WEEK: '2098-01-06', BOOKING_LAST_WEEK: '2098-12-29', BOOKING_CLOSED_WEEKS: '[]' };
  const context = vm.createContext({ console, PropertiesService: { getScriptProperties: () => ({ getProperty: key => properties[key] }) }, Utilities: { formatDate: () => '2098-01-01' } });
  vm.runInContext(source, context);
  context.getActiveProducts_ = () => ({ AFTER3: { itemCode: 'AFTER3', itemName: '3 days/week', priceCents: 7200, taxRatePercent: 13 } });
  return { context, properties };
}
test('four and eight consecutive weeks agree between browser and backend across months', () => {
  const { context } = backend();
  for (const weekCount of [4, 8]) {
    const result = context.normalizeBooking_({ startDate: '2098-01-20', weekCount });
    assert.deepEqual(result.paidWeekStarts.split(', '), bookingWeeks('2098-01-20', weekCount));
    assert.match(result.monthsCovered, /2098-01, 2098-02/);
    const pricing = context.calculateTrustedPricing_(['AFTER3'], result);
    assert.equal(pricing.expectedAmountCents, Math.round(7200 * weekCount * 1.13));
  }
});
test('invalid dates, non-Mondays and invalid week counts are rejected', () => {
  const { context } = backend();
  for (const startDate of ['2098-02-30', '2098-01-21', '', '2020-01-06']) {
    assert.throws(() => context.normalizeBooking_({ startDate, weekCount: 4 }));
    assert.throws(() => bookingWeeks(startDate, 4));
  }
  for (const weekCount of [0, 3, 4.5, 53, NaN, '4']) {
    assert.throws(() => context.normalizeBooking_({ startDate: '2098-01-20', weekCount }));
  }
});
test('closed weeks and the end of the calendar cannot be purchased', () => {
  const { context, properties } = backend();
  properties.BOOKING_CLOSED_WEEKS = '["2098-02-03"]';
  assert.throws(() => context.normalizeBooking_({ startDate: '2098-01-20', weekCount: 4 }));
  assert.throws(() => bookingWeeks('2098-01-20', 4, { closedWeeks: ['2098-02-03'] }));
  assert.throws(() => context.normalizeBooking_({ startDate: '2098-12-22', weekCount: 4 }));
  properties.BOOKING_FIRST_WEEK = '';
  assert.throws(() => context.normalizeBooking_({ startDate: '2098-01-20', weekCount: 4 }));
});
test('schema extensions preserve legacy payment columns and protect spreadsheet cells', () => {
  const { context } = backend();
  const headers = vm.runInContext('REGISTRATION_HEADERS', context);
  assert.equal(headers[17], 'paidAt');
  assert.equal(headers[21], 'startDate');
  assert.equal(context.safeCell_('=1+1'), "'=1+1");
});
test('paid verification preserves weeks, rejects wrong orders, and does not duplicate writes', () => {
  const { context } = backend();
  let rows = [], locked = false, writes = 0;
  const attempt = { orderId: 'order1', stripeSessionId: 'cs_test_abc', expectedAmountCents: 32544, ...context.normalizeBooking_({ startDate: '2098-01-20', weekCount: 4 }) };
  const session = { object: 'checkout.session', payment_status: 'unpaid', amount_total: 32544, currency: 'cad', metadata: { programCode: 'after_school_program', orderId: 'order1' } };
  context.LockService = { getScriptLock: () => ({ waitLock: () => { locked = true; }, releaseLock: () => { locked = false; } }) };
  context.stripeGet_ = () => session;
  context.getAttemptBySessionId_ = () => attempt;
  context.getSpreadsheet_ = () => ({ getSheetByName: () => ({}) });
  context.readRows_ = () => rows;
  context.updateAttemptByOrderId_ = () => {};
  context.sendEnrollmentNotificationSafely_ = () => {};
  context.upsertRegistrationBySessionId_ = record => { assert.ok(locked); writes++; rows.push(record); };
  assert.equal(context.verifyCheckoutSession_({ sessionId: 'cs_test_abc' }).paid, false);
  assert.equal(writes, 0);
  session.payment_status = 'paid';
  session.metadata.orderId = 'wrong';
  assert.throws(() => context.verifyCheckoutSession_({ sessionId: 'cs_test_abc' }));
  session.metadata.orderId = 'order1';
  session.amount_total = 1;
  assert.throws(() => context.verifyCheckoutSession_({ sessionId: 'cs_test_abc' }));
  session.amount_total = 32544;
  context.verifyCheckoutSession_({ sessionId: 'cs_test_abc' });
  context.verifyCheckoutSession_({ sessionId: 'cs_test_abc' });
  assert.equal(writes, 1);
  assert.equal(rows[0].paidWeekStarts, attempt.paidWeekStarts);
  assert.equal(locked, false);
});
