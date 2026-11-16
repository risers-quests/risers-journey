// Tests started on this device, so a child can stop and carry on later.
// Only the session code and name are kept here; the answers are saved on
// the server after every question. Browser storage can be unavailable
// (private browsing), so every access is guarded.
const KEY = "lh-diagnostic-tests";

export interface SavedTest {
  id: string;
  childName: string;
  startedAt: string;
}

export function savedTests(): SavedTest[] {
  try {
    const list = JSON.parse(localStorage.getItem(KEY) || "[]");
    return Array.isArray(list) ? list : [];
  } catch {
    return [];
  }
}

export function rememberTest(t: SavedTest): void {
  try {
    const list = savedTests().filter((x) => x.id !== t.id);
    localStorage.setItem(KEY, JSON.stringify([t, ...list].slice(0, 20)));
  } catch {
    /* not available: the code still works on any device */
  }
}

export function forgetTest(id: string): void {
  try {
    localStorage.setItem(KEY, JSON.stringify(savedTests().filter((x) => x.id !== id)));
  } catch {
    /* ignore */
  }
}
