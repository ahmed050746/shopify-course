// ============================================================
// AWC Payment — Web App (paste into Apps Script, then Deploy)
// ============================================================
// pay.html POST fields: name, fn, ln, phone, phone_e164, email, city,
// order_id, screenshot (base64 data URL)

const SCREENSHOT_FOLDER_ID = "1MG3Cwtarbxahh24ndavtr-jJHH6E7JvQ";
const PAYMENT_VALUE = 4500;
const PAYMENT_CURRENCY = "PKR";
const COUNTRY_CODE = "PK";

function doPost(e) {
  try {
    const sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
    const timestamp = new Date();
    const params = e && e.parameter ? e.parameter : {};

    const name = (params.name || "").trim();
    const fnParam = (params.fn || "").trim();
    const lnParam = (params.ln || "").trim();
    const phone = (params.phone || "").trim();
    const phoneE164 = (params.phone_e164 || "").trim();
    const email = (params.email || "").trim();
    const city = (params.city || "").trim();
    const orderId = (params.order_id || "").trim();
    const screenshotData = params.screenshot || "";

    const nameParts = fnParam || lnParam
      ? { fn: fnParam, ln: lnParam }
      : splitName_(name);
    const displayName = name || [nameParts.fn, nameParts.ln].filter(Boolean).join(" ");

    let screenshotLink = "";
    if (screenshotData && screenshotData !== "") {
      try {
        const folder = DriveApp.getFolderById(SCREENSHOT_FOLDER_ID);
        const base64Data = screenshotData.split(",")[1];
        const blob = Utilities.newBlob(
          Utilities.base64Decode(base64Data),
          "image/png",
          displayName + "_" + timestamp.getTime() + ".png"
        );
        const file = folder.createFile(blob);
        screenshotLink = file.getUrl();
      } catch (imgError) {
        screenshotLink = "Upload failed: " + imgError.toString();
      }
    }

    sheet.appendRow([
      timestamp,
      displayName,
      phone,
      screenshotLink,
      email,
      orderId,
      city,
      COUNTRY_CODE,
      PAYMENT_VALUE,
      PAYMENT_CURRENCY,
      nameParts.fn,
      nameParts.ln,
      phoneE164
    ]);

    return ContentService.createTextOutput(
      JSON.stringify({ success: true, message: "Data saved", imageLink: screenshotLink, order_id: orderId })
    ).setMimeType(ContentService.MimeType.JSON);
  } catch (error) {
    return ContentService.createTextOutput(
      JSON.stringify({ success: false, error: error.toString() })
    ).setMimeType(ContentService.MimeType.JSON);
  }
}

function doGet() {
  return ContentService.createTextOutput("Server is running! Use POST request to submit data.");
}

function splitName_(fullName) {
  const parts = (fullName || "").trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return { fn: "", ln: "" };
  if (parts.length === 1) return { fn: parts[0], ln: "" };
  return { fn: parts[0], ln: parts.slice(1).join(" ") };
}
