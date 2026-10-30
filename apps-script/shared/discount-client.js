// Embedded unchanged at the end of each standalone registration backend.
// Only server-side Script Properties contain the shared service credentials.
function discountServiceConfigured_() {
  const properties = PropertiesService.getScriptProperties();
  return Boolean(properties.getProperty("DISCOUNT_SERVICE_URL") && properties.getProperty("DISCOUNT_SERVICE_KEY"));
}

function discountMode_() {
  const mode = String(PropertiesService.getScriptProperties().getProperty("STRIPE_MODE") || "").trim().toLowerCase();
  if (mode !== "test" && mode !== "live") throw new Error("Invalid Stripe mode.");
  return mode;
}

function discountServiceRequest_(action, data) {
  const properties = PropertiesService.getScriptProperties();
  const url = properties.getProperty("DISCOUNT_SERVICE_URL");
  const key = properties.getProperty("DISCOUNT_SERVICE_KEY");
  if (!url || !/^https:\/\/script\.google\.com\/macros\/s\/[A-Za-z0-9_-]+\/exec$/.test(url) || !key) throw clientError_("Discounts are temporarily unavailable. Please try again later.");
  const response = UrlFetchApp.fetch(url, { method: "post", contentType: "text/plain;charset=utf-8", muteHttpExceptions: true,
    payload: JSON.stringify(Object.assign({}, data, { action: action, programCode: PROGRAM_CODE, stripeMode: discountMode_(), serviceKey: key })) });
  const result = JSON.parse(response.getContentText());
  if (response.getResponseCode() !== 200 || !result || result.success !== true) throw clientError_(result.error || "The discount could not be checked.");
  return result;
}

function discountApplyPricing_(data, pricing, taxRatePercent) {
  pricing.discountCode = String(data.discountCode || "").trim().toUpperCase();
  pricing.discountCents = 0;
  if (!pricing.discountCode) return pricing;
  if (!/^[A-Z0-9][A-Z0-9_-]{0,39}$/.test(pricing.discountCode)) throw clientError_("Enter a valid discount code.");
  const email = String(data.parentEmail || data.email || "").trim().toLowerCase();
  const quote = discountServiceRequest_("quote", { discountCode: pricing.discountCode, email: email });
  if (!Number.isSafeInteger(quote.discountCents) || quote.discountCents <= 0 || !Number.isFinite(taxRatePercent) || taxRatePercent < 0 || taxRatePercent > 100) throw new Error("Invalid discount quote.");
  if (quote.discountCents >= pricing.subtotalCents) throw clientError_("This discount cannot be used with this registration.");
  pricing.discountCents = quote.discountCents;
  pricing.taxCents = Math.round((pricing.subtotalCents - quote.discountCents) * taxRatePercent / 100);
  pricing.totalCents = pricing.subtotalCents - quote.discountCents + pricing.taxCents;
  pricing.expectedAmountCents = pricing.totalCents;
  pricing.discountEmail = email;
  if (pricing.items && pricing.items.length === 1) {
    pricing.items[0].taxCents = pricing.taxCents;
    pricing.items[0].totalCents = pricing.totalCents;
  }
  return pricing;
}

function discountPricingResponse_(pricing) {
  return { success: true, discountCode: pricing.discountCode || "", discountCents: pricing.discountCents || 0,
    subtotalCents: pricing.subtotalCents, taxCents: pricing.taxCents,
    expectedAmountCents: pricing.expectedAmountCents === undefined ? pricing.totalCents : pricing.expectedAmountCents };
}

function discountReservePricing_(pricing, orderId) {
  if (!pricing.discountCode) return;
  const reservation = discountServiceRequest_("reserve", { discountCode: pricing.discountCode, discountCents: pricing.discountCents,
    email: pricing.discountEmail, orderId: orderId, expectedAmountCents: pricing.totalCents });
  if (!reservation.token) throw new Error("The discount reservation could not be created.");
  pricing.discountReservation = reservation.token;
}

function discountAttachSession_(pricing, orderId, session) {
  if (!pricing.discountCode) return;
  discountServiceRequest_("attach", { discountCode: pricing.discountCode, email: pricing.discountEmail,
    orderId: orderId, token: pricing.discountReservation, stripeSessionId: session.id });
}

function discountConfirmSession_(sessionId) {
  if (!discountServiceConfigured_()) return;
  try { discountServiceRequest_("confirm", { stripeSessionId: sessionId }); }
  catch (_) { console.log("Discount usage will be reconciled on the next discount request."); }
}
