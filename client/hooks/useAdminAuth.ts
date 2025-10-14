import { useEffect, useState } from "react";
import { getSessionAuthed, getStoredPassHash, setSessionAuthed, setStoredPassHash, sha256Hex } from "@/lib/auth";

export function useAdminAuth() {
  const [authed, setAuthed] = useState<boolean>(getSessionAuthed());
  const [hasPass, setHasPass] = useState<boolean>(!!getStoredPassHash());
  const [error, setError] = useState<string>("");

  useEffect(() => {
    setHasPass(!!getStoredPassHash());
    setAuthed(getSessionAuthed());
  }, []);

  const login = async (password: string) => {
    setError("");
    const stored = getStoredPassHash();
    if (!stored) { setError("No admin password set"); return false; }
    const hash = await sha256Hex(password);
    if (hash === stored) { setSessionAuthed(true); setAuthed(true); return true; }
    setError("Incorrect password");
    return false;
  };

  const logout = () => { setSessionAuthed(false); setAuthed(false); };

  const setPassword = async (password: string) => {
    const hash = await sha256Hex(password);
    setStoredPassHash(hash);
    setHasPass(true);
  };

  return { authed, hasPass, login, logout, setPassword, error };
}
