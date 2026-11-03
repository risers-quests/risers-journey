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
