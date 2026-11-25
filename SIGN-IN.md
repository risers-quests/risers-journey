# Sign-in

Nothing on Risers Journey opens without signing in: no page, picture or
saved work. Classroom devices are shared, so it works in two steps:

1. **The device** is set up once by a facilitator. It stays set up for
   60 days.
2. **The person** taps their name and types a PIN: 4 digits for a Riser, 6
   for a facilitator. After 15 minutes with no activity they're signed out,
   with a warning a minute before.

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
| Facilitators' PINs, device codes and refused saves | `staff/sign-in/` |
| Every page's sign-in helper (first script in `<head>`) | `assets/session.js` |
| The data store (Cloudflare Worker); this is a copy, the live one is pasted into Cloudflare | `worker/progress-worker.js` |

**Adding a Riser or facilitator:** add them to `lib/rj-auth.ts`. A Riser
also goes in `KID_IDS` in `worker/progress-worker.js`, which then has to be
pasted into Cloudflare again.

## Settings

| Where | Name | Value |
|---|---|---|
| Vercel | `AUTH_SECRET` | A long random secret. It must match the Worker's. |
| Vercel | `RJ_SETUP_CODE` | 12 letters and numbers. It sets up any device and lets a facilitator make their first PIN. |
| Vercel | `RJ_AUTH` | `on` switches the gate on. `off`, or not set, leaves the site as it was before the sign-in. |
| Cloudflare Worker | `AUTH_SECRET` (secret) | The same value as in Vercel |
| Cloudflare Worker | `LEGACY_KEY` (text) | `on` while the old shared key still has to work. Set it to `off` once the sign-in is live. |

**To undo the sign-in:** set `RJ_AUTH` to `off` in Vercel and redeploy.
The pages go back to the old key, so `LEGACY_KEY` must be `on` too.
