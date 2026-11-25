# Sign-in

Nothing on Risers Journey opens without signing in: no page, picture or
saved work. Everyone taps their name and types a 6-digit PIN. 5 wrong tries
lock that name for 15 minutes. After 15 minutes with no activity they're
signed out, with a warning a minute before. A facilitator's very first
sign-in makes their own PIN, using the set-up code (`RJ_SETUP_CODE`).

Once signed in, a Riser can only open their own pages and their own saved
work. Staff pages, staff views and other Risers' quests are closed to them,
and the data store checks the same rules again. A facilitator can open
everything.

## Where things are

| Part | File |
|---|---|
| The gate, run on every request | `middleware.ts` |
| The sign-in API (`/api/auth/...`) | `api/auth.ts` |
| Shared signing code, and the lists of Risers and facilitators | `lib/rj-auth.ts` |
| Sign-in page | `signin/` |
| Setting PINs, and saves that were refused | `staff/sign-in/` |
| Every page's sign-in helper (first script in `<head>`) | `assets/session.js` |
| The data store (Cloudflare Worker); this is a copy, the live one is pasted into Cloudflare | `worker/progress-worker.js` |

**Adding a Riser or facilitator:** add them to `lib/rj-auth.ts` (and a
Riser to `dashboard/roster.js` and `end-of-term-2/shared/eot2-data.js`).
The data store needs no change. The pretend Riser `tester` (shown as "Aarav")
is for trying things out; remove it from those three files when done.

## Settings

| Where | Name | Value |
|---|---|---|
| Vercel | `AUTH_SECRET` | A long random secret. It must match the Worker's. |
| Vercel | `RJ_SETUP_CODE` | 12 letters and numbers. It lets a facilitator make their first PIN. |
| Vercel | `RJ_AUTH` | `on` switches the gate on. `off`, or not set, leaves the site as it was before the sign-in. |
| Cloudflare Worker | `AUTH_SECRET` (secret) | The same value as in Vercel |
| Cloudflare Worker | `LEGACY_KEY` (text) | `on` while the old shared key still has to work. Set it to `off` once the sign-in is live. |

**To undo the sign-in:** set `RJ_AUTH` to `off` in Vercel and redeploy.
The pages go back to the old key, so `LEGACY_KEY` must be `on` too.
