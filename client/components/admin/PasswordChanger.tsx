import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useAdminAuth } from "@/hooks/useAdminAuth";

export default function PasswordChanger() {
  const { hasPass, setPassword } = useAdminAuth();
  const [p1, setP1] = useState("");
  const [p2, setP2] = useState("");
  const [saved, setSaved] = useState(false);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!p1 || p1 !== p2) return;
    await setPassword(p1);
    setP1(""); setP2(""); setSaved(true);
    setTimeout(()=>setSaved(false), 2000);
  };

  return (
    <form onSubmit={onSubmit} className="rounded-lg border p-3 grid gap-2">
      <div className="text-sm font-medium">Admin Password</div>
      <Input type="password" placeholder={hasPass?"New password":"Set password"} value={p1} onChange={(e)=>setP1(e.target.value)} required />
      <Input type="password" placeholder="Confirm password" value={p2} onChange={(e)=>setP2(e.target.value)} required />
      {p1 && p2 && p1!==p2 && <p className="text-xs text-destructive">Passwords do not match</p>}
      <Button type="submit" disabled={!p1 || p1!==p2}>{hasPass?"Change Password":"Set Password"}</Button>
      {saved && <p className="text-xs text-green-700">Saved</p>}
    </form>
  );
}
