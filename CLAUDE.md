# Working with me (for Claude)

- **Summaries:** when a piece of work is done, summarise it as a table (or
  something equally simple), one short line per item. Keep it easy to scan.
- **Be brutal:** give honest, direct feedback on my ideas without being
  asked: what works, what won't, and why. Then say what you'd do instead.

# Diagnostic tool (diagnostic-tool/)

- It's React; the rest of the site is plain HTML/JS with no build step.
- `diagnostic/` is its built page, committed and served as it is. **After
  any change in `diagnostic-tool/client/`, run `npm run build:diagnostic` at
  the repo root and commit `diagnostic/` in the same commit**, or the live
  page stays on the old version.
- HTML-only changes elsewhere: nothing to build.
