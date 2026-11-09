# For later — to discuss

## 1. Storage alternatives

Everything the site saves (quest boards, schedules, check-ins, assessments
and marks, Assessment Tracking, observations) goes to one Cloudflare
Worker's key–value store through `/sync`, one record per Riser or team.

To talk through:
- Is one Worker and KV store enough as the data grows, and what happens if
  it's down or a record is overwritten?
- Who can read it: the site key is in the public code, so the records
  (grades, feedback, observations) are only as private as that key.
- Options to compare: keep KV and add access control; a real database
  (Cloudflare D1, Supabase, Firebase); or Google Sheets / Drive as the store.

## 2. Exporting data (for backup)

There's no way yet to get the data out in one go.

To talk through:
- What to export (all of it, or per area: assessments, tracking,
  observations, schedules, check-ins, quests) and in what form (Excel /
  CSV for people, JSON for a full restore).
- How often (a staff "Download a backup" button, and/or an automatic
  weekly copy, e.g. to Google Drive), and where backups are kept.
- Restoring from a backup.

## 3. Stop paying Cloudflare (switch to its free storage)

We pay because the Worker keeps everything in Cloudflare KV, whose free
plan allows only ~1,000 saves a day and 1 GB (boards save as people type;
build videos and quest photos take space).

Plan:
- Rewrite the Worker (`worker/worker.js` in the staff-data repo) to use
  Cloudflare's free database (D1: 100,000 saves a day, 5 GB) and free file
  store (R2: 10 GB). The site itself doesn't change.
- Back up all data first, copy it across, then switch the plan to free.
- Also remove the paid Anthropic key from the Worker (only used by a Term 2
  answer checker; Term 2 is over).
- Needs: someone with the Cloudflare login for about an hour.

## 4. Retire the staff-data site

The private staff-data repo (risers-term2-digital-quests-staff-data) holds:
the Worker's code, the Term 3 Maths answer key, Term 1 conference data, and
the Term 2 Teacher's View, Feedback report, Guide and answer keys. Its
website has no lock: anyone with the address can open answer keys and
kids' Term 2 answers.

Plan:
- Move the Worker's code to its own private repo.
- Put the Maths key inside the site, locked with the facilitator PIN (like
  uploaded papers).
- Keep a backup of the Term 1 and Term 2 material; remove their links from
  the portal.
- Then switch the staff-data website off on Vercel and archive the repo.

## 5. Archive unused GitHub repositories

Not used by the site: risers-term2-digital-quests, core-skills-observation
(check no one still uses it), risers-digital-level3-quest-immune-system,
Internet-safety-course, quest-engine-docs, Claude-quest-generator,
Risers-quest-generator-tool, Risers-quests-field-log, Risers-tracker.
Archive (not delete) on GitHub.
