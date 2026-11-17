# Admin console: one-time setup (about 15 minutes, on a computer)

Jeran's Admin console: fees owing, recording payments, reminder drafts, and
the emails waiting for a reply, in one page. It's opened from the **Admin**
tile on the staff dashboard (shown only when Jeran is signed in).

**Where the data lives:** in one Google Sheet and in Gmail, both in the
LifeHub admin Google account. None of it is on the Risers Journey site,
whose code is public. This folder holds only the console's code.

**Who can open it:** only the LifeHub admin Google account. Google checks
the sign-in, so a link that is passed on, or someone choosing "Jeran" on the
staff sign-in, still can't open it.

## 1. Make the Google Sheet

Sign in to Google as the LifeHub admin account.

1. Upload `LifeHub Admin 2026-27.xlsx` to Google Drive. It's sent separately
   and is never put in this repo.
2. Open it, then **File → Save as Google Sheets**. Use the new Google Sheet
   from now on. Keep the old .xlsx files as a backup, but stop adding to them.
3. Read the **Start here** tab and work through its "Check before use" list
   (overpayments, combined payments, mismatched arrangements, missing
   parent emails).

## 2. Add the console

1. In the Google Sheet: **Extensions → Apps Script**.
2. Replace everything in `Code.gs` with this folder's `Code.gs`.
3. **+ → HTML**, name it `Console` (exactly), and paste in `Console.html`.
4. Save.

## 3. Publish it, for one person only

1. **Deploy → New deployment**. Click the gear and choose **Web app**.
2. Execute as: **Me**. Who has access: **Only myself**.
3. **Deploy**, then allow the permissions it asks for. It needs to read
   and write this Sheet, read Gmail, and create Gmail drafts. It never
   sends email.
4. Copy the **Web app URL** (it ends in `/exec`) and send it over. It goes
   into the dashboard's Admin tile (`ADMIN_CONSOLE_URL` in
   `staff/staff-home.js`). Until then the tile says "Coming soon".

Reopen the Sheet and an **Admin** menu appears, with a link to the console.

## Using it

| Job | How |
|---|---|
| See what needs a reply | Top of the console: parents' emails, plus the senders listed in **Settings** as "Watch: …" (e.g. website enquiries), where the last message isn't ours. "payment?" marks ones that look like payment proofs. Tap one to open it in Gmail. |
| Record a payment | "Paid…" on the child's row, or the form. One row is added to **Payments**; the balance updates. |
| Send reminders | Tick the children, then **Draft reminders**. One draft per family (siblings share one email). Check and send them from Gmail drafts. The wording is in **Settings**. |
| Past years' dues | Their own table; "Paid…" records against that year's row. |
| Change anything else | In the Sheet. Don't type in Students' Paid, Balance or Last payment columns; they work themselves out from Payments. |

## Changing the code later

Edit the files here, paste them into the Apps Script editor again, then
**Deploy → Manage deployments → edit (pencil) → Version: New version**.
That keeps the same URL.
