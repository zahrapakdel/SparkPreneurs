# Weekly after-school registration

The source in this repository extends the existing after-school Apps Script backend. It has not been deployed. The page requires `bookingVersion: 1`, so an old backend cannot charge for a date selection it does not store.

## Calendar decisions required

Confirm the first and last available starting Mondays and any full-week closures. Prices remain the existing weekly prices. Bookings contain 4–52 consecutive calendar weeks; a block containing a closed week is rejected, not silently extended. Partial-week holidays and weekday attendance combinations must be confirmed with the business separately.

## Deployment

1. Back up the existing Google workbook and Apps Script source. Confirm the spreadsheet ID at the top of `AFTER_SCHOOL_PROGRAM.gs` is the intended workbook before using it.
2. Test the source with a separate test workbook and Stripe test credentials first. Keep credentials only in Script Properties.
3. Set `BOOKING_FIRST_WEEK` and `BOOKING_LAST_WEEK` to inclusive Monday dates in `YYYY-MM-DD` format. Set `BOOKING_CLOSED_WEEKS` to a JSON array of closed Mondays, or `[]`.
4. Run `setupPeriodWorkbook`. It appends booking columns while preserving existing column positions and records; unexpected existing headers cause an error. Old registrations retain empty booking fields because their dates are unknown.
5. Deploy a test web app. Verify calendar, invalid-date/amount rejection, unpaid checkout, a successful test payment and repeated verification. Test the page against the test endpoint in an isolated preview; its production readiness check intentionally requires live mode.
6. Add a time-driven trigger for `reconcilePendingPayments` every five minutes. It verifies pending sessions directly with Stripe when the customer does not return to the page.
7. After test validation, deploy the approved source to the intended live Apps Script project with its live Script Properties. Confirm `ping` reports version `2026-09-19-1`, `bookingVersion: 1`, the expected program, and live mode. Update the page endpoint if the deployment URL changes.

The workbook records one paid registration per Stripe session. Added columns are `startDate`, `endDate` (Friday of the final week), `weekCount`, `paidWeekStarts` (every purchased Monday), and `monthsCovered` (including both months for a crossing week). These fields are calculated server-side, saved before checkout, and copied to the paid registration after Stripe verification. They are available in Excel exports.

Run local logic tests with `node --test tests/after-school.test.mjs`.
