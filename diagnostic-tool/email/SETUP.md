# Report emails: one-time setup (about 10 minutes)

The diagnostic emails two reports when a test finishes: one to the child,
one to highergrade@lifehub.in. They're sent by a small Google Apps Script
in the highergrade@lifehub.in account. The children's email addresses are
kept **only in that script**, never in this (public) code.

Easiest on a computer; the Apps Script editor is awkward on an iPad.

## 1. Create the script (signed in as highergrade@lifehub.in)

1. Go to **script.google.com** → **New project**. Name it
   `LifeHub Maths Diagnostic emails`.
2. Delete what's in `Code.gs` and paste in the whole of `apps-script.gs`
   (this folder).
3. Choose the function **authorise** at the top and press **Run**. Allow
   the permission it asks for (sending email as you).

## 2. Save the settings

**Project Settings** (gear icon) → **Script properties** → add:

| Property | Value |
|---|---|
| `SECRET` | a long passphrase you make up (letters and numbers, 30+ characters) |
| `STAFF_EMAIL` | `highergrade@lifehub.in` |
| `EMAILS` | all 12 children in one value: `Benjamin = address, Chris = address, …` (the first names as on the start page) |

The 12: Benjamin, Chris, Elyon, Eva, Gabby, Karis, Michael, Owen, Pranavi,
Shalom, Yokesh, Zach. (One property per child, `EMAIL_EVA` etc., also works.)

## 3. Publish it

**Deploy** → **New deployment** → type **Web app**:
- Execute as: **Me (highergrade@lifehub.in)**
- Who has access: **Anyone**

Copy the **Web app URL**. ("Anyone" can reach it, but without the
passphrase it sends nothing.)

## 4. Tell the website

In Vercel → the **risers-journey** project → Settings → Environment
Variables, add (Production and Preview):

| Name | Value |
|---|---|
| `DIAGNOSTIC_MAIL_URL` | the Web app URL from step 3 |
| `DIAGNOSTIC_MAIL_SECRET` | the same passphrase as `SECRET` |

Then redeploy (Deployments → ⋯ → Redeploy).

## Checking

Finish a short test (e.g. Data Handling only). The end screen says whether
both emails went out; if not, it says why and offers **Send them again**.
To change a child's address later, edit it in `EMAILS`; nothing else
changes.
