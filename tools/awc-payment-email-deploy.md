# AWC Payment — Sheet, Apps Script & Meta CSV

## Google Sheet headers (row 1)

Open **AWC Payment (Responses)** → **Form Responses 1**. Add these headers left to right (skip or hide old duplicate email columns F/G if Form locked them):

| Col | Header name      | Source |
|-----|------------------|--------|
| A   | Timestamp        | Auto   |
| B   | user name        | Form / script |
| C   | user phone number| Local `03…` |
| D   | image upload     | Drive URL |
| E   | user email       | pay.html |
| F   | order_id         | pay.html `pur_…` |
| G   | city             | pay.html |
| H   | country          | `PK` in script |
| I   | value            | `4500` |
| J   | currency         | `PKR` |
| K   | fn               | First name from full name |
| L   | ln               | Rest of name |
| M   | phone_e164       | e.g. `+923321319363` |

Optional manual column later: **verified** (`Yes` when payment confirmed) for Meta Purchase uploads only.

## Apps Script (copy-paste)

Full file: [awc-payment-meta-script.gs](./awc-payment-meta-script.gs)

1. AWC sheet → **Extensions → Apps Script** (or [script.google.com](https://script.google.com)).
2. Replace `Code.gs` with that file (keep `SCREENSHOT_FOLDER_ID` if yours differs).
3. **Save** → **Deploy → Manage deployments → Edit → New version → Deploy**.

`pay.html` `SCRIPT_URL` stays the same if you only deploy a new version.

## Website (pay.html)

- Single **Apps Script** POST (no Google Form `entry.xxx` duplicate).
- Fields: `name`, `phone`, `phone_e164`, `email`, `city`, `order_id`, `screenshot`.
- On submit: **InitiateCheckout** (Meta / dataLayer), **not** Purchase.
- Verified **Purchase** events → upload manually to Meta (below).

## Meta — manual Purchase upload (~every 2 days)

1. In Sheet, mark verified enrollments (payment confirmed).
2. Filter rows you trust → **File → Download → Comma-separated values (.csv)**.
3. Meta **Events Manager → your dataset → Add events** (or offline upload) → map columns: email, phone (`phone_e164`), fn, ln, city, country, event_time (from Timestamp), value, currency, **order_id** as event dedup ID.
4. Do **not** upload unverified rows as Purchase — site only fires **InitiateCheckout** on screenshot submit.

## Test checklist

1. Deploy new script version.
2. Live `pay.html` → submit test payment.
3. Sheet row: email + city + order_id + phone_e164 + Meta helper columns filled.
4. Meta: confirm InitiateCheckout in Events Manager; Purchase only after your CSV upload.

## Outside Cursor (your steps)

- Paste updated `Code.gs` + **Deploy → New version**
- Add sheet column headers **F–M** if missing
- Re-upload **pay.html** to hosting if not auto-deployed
- Form duplicate columns F/G: hide only if Form blocks delete
