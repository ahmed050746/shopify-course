/**
 * AWC Payment — reference Web App (see awc-payment-meta-script.gs for full paste-ready file).
 *
 * pay.html POST: name, phone, phone_e164, email, city, order_id, screenshot
 */

const SCREENSHOT_FOLDER_ID = "1MG3Cwtarbxahh24ndavtr-jJHH6E7JvQ";

function doPost(e) {
  try {
    const sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
    const timestamp = new Date();
    const params = e && e.parameter ? e.parameter : {};

    const name = (params.name || "").trim();
    const phone = (params.phone || "").trim();
    const phoneE164 = (params.phone_e164 || "").trim();
    const email = (params.email || "").trim();
    const city = (params.city || "").trim();
    const orderId = (params.order_id || "").trim();
    const screenshotData = params.screenshot || "";
    const nameParts = splitName_(name);

    let screenshotLink = "";
    if (screenshotData && screenshotData !== "") {
      const folder = DriveApp.getFolderById(SCREENSHOT_FOLDER_ID);
      const base64Data = screenshotData.split(",")[1];
      const blob = Utilities.newBlob(
        Utilities.base64Decode(base64Data),
        "image/png",
        name + "_" + timestamp.getTime() + ".png"
      );
      screenshotLink = folder.createFile(blob).getUrl();
    }

    sheet.appendRow([
      timestamp,
      name,
      phone,
      screenshotLink,
      email,
      orderId,
      city,
      "PK",
      4500,
      "PKR",
      nameParts.fn,
      nameParts.ln,
      phoneE164
    ]);

    return ContentService.createTextOutput(JSON.stringify({ success: true }))
      .setMimeType(ContentService.MimeType.JSON);
  } catch (error) {
    return ContentService.createTextOutput(JSON.stringify({ success: false, error: String(error) }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

function splitName_(fullName) {
  const parts = (fullName || "").trim().split(/\s+/).filter(Boolean);
  if (parts.length <= 1) return { fn: parts[0] || "", ln: "" };
  return { fn: parts[0], ln: parts.slice(1).join(" ") };
}
