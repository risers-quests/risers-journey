/**
 * Staff signed in on this device (the site's staff sign-in on /staff/,
 * which saves "rj-staff-name"). Reports show the staff part only then.
 */
export function staffSignedIn(): boolean {
  try {
    return !!localStorage.getItem("rj-staff-name");
  } catch {
    return false;
  }
}
