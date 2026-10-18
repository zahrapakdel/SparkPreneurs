// Deploy separately. This service owns discount usage across all programs.
// Keep its shared authentication key and Stripe keys in Script Properties.
const DISCOUNT_SERVICE_VERSION = "2026-10-18-discounts-1";
const DISCOUNT_USAGE_HEADERS = ["createdAt", "updatedAt", "code", "email", "stripeMode", "programCode", "orderId", "token", "stripeSessionId", "expectedAmountCents", "status"];
const DISCOUNT_CODE_HEADERS = ["code", "amountCents", "active", "expiresAt"];

function doGet() {
  return discountJson_({ success: true, version: DISCOUNT_SERVICE_VERSION });
}

function doPost(event) {
  try {
    const body = event && event.postData && event.postData.contents;
    if (!body || body.length > 12000) throw new Error("Invalid discount request.");
    const data = JSON.parse(body);
    const secret = PropertiesService.getScriptProperties().getProperty("DISCOUNT_SERVICE_KEY");
    if (!secret || secret.length < 32 || data.serviceKey !== secret) throw new Error("Discount service authentication failed.");
    return discountJson_(discountHandle_(data));
  } catch (error) {
    return discountJson_({ success: false, error: error.discountPublic ? error.message : "The discount service is temporarily unavailable." });
  }
}

function setupDiscountWorkbook() {
  const ss = discountWorkbook_();
  [["Discounts", DISCOUNT_CODE_HEADERS], ["Discount Usage", DISCOUNT_USAGE_HEADERS]].forEach(function(entry) {
    const sheet = ss.getSheetByName(entry[0]) || ss.insertSheet(entry[0]);
    if (!sheet.getLastRow()) sheet.appendRow(entry[1]);
    const headers = sheet.getRange(1, 1, 1, entry[1].length).getValues()[0];
    if (JSON.stringify(headers) !== JSON.stringify(entry[1])) throw new Error("Unexpected columns in " + entry[0]);
    sheet.setFrozenRows(1);
  });
  const codes = ss.getSheetByName("Discounts");
  if (!discountRows_(codes).some(function(row) { return String(row.code).toUpperCase() === "KUMON25"; })) {
    codes.appendRow(["KUMON25", 2500, true, ""]);
  }
  return "KUMON25 is configured for $25 off, once per email across all registrations.";
}

function discountWorkbook_() {
  const id = PropertiesService.getScriptProperties().getProperty("DISCOUNT_SPREADSHEET_ID");
  if (!id) throw new Error("Set DISCOUNT_SPREADSHEET_ID before setup.");
  return SpreadsheetApp.openById(id);
}

function discountHandle_(data) {
  if (["quote", "reserve", "attach", "confirm"].indexOf(data.action) === -1) throw new Error("Unknown discount action.");
  if (["test", "live"].indexOf(data.stripeMode) === -1) throw new Error("Invalid Stripe mode.");
  if (!/^[a-z0-9_]{1,100}$/.test(String(data.programCode || ""))) throw new Error("Invalid program.");
  const ss = discountWorkbook_();
  const usage = ss.getSheetByName("Discount Usage");
  const codes = ss.getSheetByName("Discounts");
  if (!usage || !codes) throw new Error("Run setupDiscountWorkbook first.");
  const lock = LockService.getScriptLock();
  lock.waitLock(25000);
  try {
    const rows = discountRows_(usage);
    if (data.action === "confirm") {
      const record = rows.find(function(row) { return row.stripeSessionId === data.stripeSessionId && row.stripeMode === data.stripeMode && row.programCode === data.programCode; });
      if (record) discountRefresh_(usage, record, false);
      return { success: true };
    }
    const code = String(data.discountCode || "").trim().toUpperCase();
    const email = String(data.email || "").trim().toLowerCase();
    if (!/^[A-Z0-9][A-Z0-9_-]{0,39}$/.test(code) || email.length > 120 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) throw discountError_("Enter a valid email and discount code.");
    if (data.action === "attach") {
      const record = rows.find(function(row) { return row.token === data.token && row.programCode === data.programCode && row.orderId === data.orderId && row.stripeMode === data.stripeMode && row.email === email && row.code === code; });
      if (!record || (record.stripeSessionId && record.stripeSessionId !== data.stripeSessionId)) throw new Error("Unknown discount reservation.");
      const session = discountStripe_("get", "/checkout/sessions/" + discountSessionId_(data.stripeSessionId, data.stripeMode), data.stripeMode);
      discountAssertSession_(session, record);
      record.stripeSessionId = session.id;
      record.status = session.payment_status === "paid" ? "PAID" : "CHECKOUT_CREATED";
      discountSave_(usage, record);
      return { success: true };
    }
    const matches = discountRows_(codes).filter(function(row) { return String(row.code).trim().toUpperCase() === code; });
    const config = matches[0];
    if (matches.length !== 1 || !config || !/^(true|1|yes)$/i.test(String(config.active))) throw discountError_("This discount code is invalid or inactive.");
    const amountCents = Number(config.amountCents);
    if (!Number.isSafeInteger(amountCents) || amountCents <= 0) throw new Error("Invalid discount amount.");
    if (config.expiresAt && (!Number.isFinite(new Date(config.expiresAt).getTime()) || new Date(config.expiresAt).getTime() <= Date.now())) throw discountError_("This discount code has expired.");
    rows.filter(function(row) { return row.code === code && row.email === email && row.stripeMode === data.stripeMode; }).forEach(function(record) {
      if (record.status === "PAID") throw discountError_("This discount code has already been used with this email.");
      if (record.status === "EXPIRED") return;
      if (!record.stripeSessionId) throw discountError_("A discount checkout is still being prepared or needs review. Please contact SparkPreneurs if it does not complete.");
      discountRefresh_(usage, record, data.action === "reserve");
      if (record.status === "PAID") throw discountError_("This discount code has already been used with this email.");
      if (data.action === "reserve" && record.status !== "EXPIRED") throw discountError_("A checkout using this discount is still processing. Please try again later.");
    });
    if (data.action === "quote") return { success: true, discountCode: code, discountCents: amountCents };
    if (!/^[A-Za-z0-9_-]{1,150}$/.test(String(data.orderId || "")) || !Number.isSafeInteger(data.expectedAmountCents) || data.expectedAmountCents <= 0) throw new Error("Invalid checkout reservation.");
    if (data.discountCents !== amountCents) throw discountError_("The discount changed. Apply the code again.");
    const now = new Date().toISOString();
    const record = { createdAt: now, updatedAt: now, code: code, email: email, stripeMode: data.stripeMode,
      programCode: data.programCode, orderId: data.orderId, token: Utilities.getUuid(), stripeSessionId: "",
      expectedAmountCents: data.expectedAmountCents, status: "RESERVED" };
    usage.appendRow(DISCOUNT_USAGE_HEADERS.map(function(header) { return discountCell_(record[header]); }));
    SpreadsheetApp.flush();
    return { success: true, token: record.token };
  } finally { lock.releaseLock(); }
}

function discountRefresh_(sheet, record, expire) {
  const id = discountSessionId_(record.stripeSessionId, record.stripeMode);
  let session = discountStripe_("get", "/checkout/sessions/" + id, record.stripeMode);
  discountAssertSession_(session, record);
  if (session.payment_status !== "paid" && session.status === "open" && expire) {
    // Stripe rejects expiration if a payment wins the race. Do not issue a
    // replacement discount when that happens or when the response is uncertain.
    session = discountStripe_("post", "/checkout/sessions/" + id + "/expire", record.stripeMode);
    discountAssertSession_(session, record);
  }
  record.status = session.payment_status === "paid" ? "PAID" : session.status === "expired" ? "EXPIRED" : "CHECKOUT_CREATED";
  discountSave_(sheet, record);
}

function discountAssertSession_(session, record) {
  if (!session || !session.metadata || session.metadata.orderId !== record.orderId ||
      session.metadata.programCode !== record.programCode || session.currency !== "cad" ||
      String(session.customer_email || "").trim().toLowerCase() !== record.email ||
      session.livemode !== (record.stripeMode === "live") ||
      Number(session.amount_total) !== Number(record.expectedAmountCents)) throw new Error("Discount checkout does not match the reservation.");
}

function discountSessionId_(value, mode) {
  if (!(new RegExp("^cs_" + mode + "_[A-Za-z0-9]+$")).test(String(value || ""))) throw new Error("Invalid Stripe session.");
  return encodeURIComponent(value);
}

function discountSave_(sheet, record) {
  record.updatedAt = new Date().toISOString();
  sheet.getRange(record._row, 1, 1, DISCOUNT_USAGE_HEADERS.length).setValues([DISCOUNT_USAGE_HEADERS.map(function(header) { return discountCell_(record[header]); })]);
  SpreadsheetApp.flush();
}

function discountRows_(sheet) {
  const values = sheet.getDataRange().getValues();
  const headers = values.shift();
  return values.map(function(row, index) {
    const record = { _row: index + 2 };
    headers.forEach(function(header, column) {
      const value = row[column];
      record[header] = typeof value === "string" && /^'[=+\-@]/.test(value) ? value.slice(1) : value;
    });
    return record;
  });
}

function discountStripe_(method, path, mode) {
  const key = PropertiesService.getScriptProperties().getProperty(mode === "live" ? "STRIPE_SECRET_KEY_LIVE" : "STRIPE_SECRET_KEY_TEST");
  if (!key || !key.startsWith("sk_" + mode + "_")) throw new Error("Configure the discount service Stripe key for this mode.");
  const response = UrlFetchApp.fetch("https://api.stripe.com/v1" + path, { method: method, headers: { Authorization: "Bearer " + key }, muteHttpExceptions: true });
  if (response.getResponseCode() < 200 || response.getResponseCode() >= 300) throw new Error("Stripe discount session check failed.");
  return JSON.parse(response.getContentText());
}

function discountError_(message) { const error = new Error(message); error.discountPublic = true; return error; }
function discountCell_(value) { return typeof value === "string" && /^[=+\-@]/.test(value) ? "'" + value : value; }
function discountJson_(value) { return ContentService.createTextOutput(JSON.stringify(value)).setMimeType(ContentService.MimeType.JSON); }
