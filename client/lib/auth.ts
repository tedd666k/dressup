const PASS_KEY = "meya.admin.hash";
const SESSION_KEY = "meya.admin.session";
const SESSION_TOKEN_KEY = "meya.admin.token";
const SESSION_TIMESTAMP_KEY = "meya.admin.ts";
const SESSION_TIMEOUT = 30 * 60 * 1000; // 30 minutes

export async function sha256Hex(text: string): Promise<string> {
  const enc = new TextEncoder().encode(text);
  const buf = await crypto.subtle.digest("SHA-256", enc);
  const arr = Array.from(new Uint8Array(buf));
  return arr.map((b) => b.toString(16).padStart(2, "0")).join("");
}

export async function generateSessionToken(): Promise<string> {
  const randomBytes = new Uint8Array(32);
  crypto.getRandomValues(randomBytes);
  const arr = Array.from(randomBytes);
  return arr.map((b) => b.toString(16).padStart(2, "0")).join("");
}

export function getStoredPassHash(): string | null {
  try { return localStorage.getItem(PASS_KEY); } catch { return null; }
}

export function setStoredPassHash(hash: string) {
  localStorage.setItem(PASS_KEY, hash);
}

export async function setSessionAuthed(v: boolean) {
  if (v) {
    const token = await generateSessionToken();
    sessionStorage.setItem(SESSION_TOKEN_KEY, token);
    sessionStorage.setItem(SESSION_TIMESTAMP_KEY, Date.now().toString());
    sessionStorage.setItem(SESSION_KEY, "1");
  } else {
    sessionStorage.removeItem(SESSION_TOKEN_KEY);
    sessionStorage.removeItem(SESSION_TIMESTAMP_KEY);
    sessionStorage.removeItem(SESSION_KEY);
  }
}

export function getSessionAuthed(): boolean {
  try {
    const authed = sessionStorage.getItem(SESSION_KEY) === "1";
    if (!authed) return false;

    // Check session timeout
    const timestamp = sessionStorage.getItem(SESSION_TIMESTAMP_KEY);
    if (!timestamp) return false;

    const elapsed = Date.now() - parseInt(timestamp);
    if (elapsed > SESSION_TIMEOUT) {
      setSessionAuthed(false);
      return false;
    }

    // Refresh timestamp on access
    sessionStorage.setItem(SESSION_TIMESTAMP_KEY, Date.now().toString());
    return true;
  } catch {
    return false;
  }
}

export function getSessionToken(): string | null {
  try { return sessionStorage.getItem(SESSION_TOKEN_KEY); } catch { return null; }
}
