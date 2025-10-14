const PASS_KEY = "meya.admin.hash";
const SESSION_KEY = "meya.admin.session";

export async function sha256Hex(text: string): Promise<string> {
  const enc = new TextEncoder().encode(text);
  const buf = await crypto.subtle.digest("SHA-256", enc);
  const arr = Array.from(new Uint8Array(buf));
  return arr.map((b) => b.toString(16).padStart(2, "0")).join("");
}

export function getStoredPassHash(): string | null {
  try { return localStorage.getItem(PASS_KEY); } catch { return null; }
}

export function setStoredPassHash(hash: string) {
  localStorage.setItem(PASS_KEY, hash);
}

export function setSessionAuthed(v: boolean) {
  sessionStorage.setItem(SESSION_KEY, v ? "1" : "0");
}

export function getSessionAuthed(): boolean {
  try { return sessionStorage.getItem(SESSION_KEY) === "1"; } catch { return false; }
}
