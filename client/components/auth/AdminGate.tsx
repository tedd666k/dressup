import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useAdminAuth } from "@/hooks/useAdminAuth";

export default function AdminGate({ children }: { children: React.ReactNode }) {
  const { authed, hasPass, login, setPassword, error } = useAdminAuth();
  const [pwd, setPwd] = useState("");
  const [pwd2, setPwd2] = useState("");

  if (authed) return <>{children}</>;

  return (
    <div className="min-h-[60vh] flex items-center justify-center">
      <div className="w-full max-w-sm rounded-xl border bg-card p-6">
        <h1 className="text-xl font-serif mb-2">Admin Access</h1>
        {hasPass ? (
          <form className="space-y-3" onSubmit={async (e)=>{e.preventDefault(); await login(pwd);}}>
            <Input type="password" placeholder="Password" value={pwd} onChange={(e)=>setPwd(e.target.value)} required />
            {error && <p className="text-sm text-destructive">{error}</p>}
            <Button type="submit" className="w-full">Enter</Button>
          </form>
        ) : (
          <form className="space-y-3" onSubmit={async (e)=>{e.preventDefault(); if(pwd!==pwd2) return; await setPassword(pwd);}}>
            <p className="text-sm text-muted-foreground">Set an admin password to secure /admin.</p>
            <Input type="password" placeholder="New password" value={pwd} onChange={(e)=>setPwd(e.target.value)} required />
            <Input type="password" placeholder="Confirm password" value={pwd2} onChange={(e)=>setPwd2(e.target.value)} required />
            {pwd && pwd2 && pwd!==pwd2 && <p className="text-sm text-destructive">Passwords do not match</p>}
            <Button type="submit" className="w-full" disabled={!pwd || pwd!==pwd2}>Set Password</Button>
          </form>
        )}
      </div>
    </div>
  );
}
