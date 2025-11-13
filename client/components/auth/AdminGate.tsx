import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useAdminAuth } from "@/hooks/useAdminAuth";
import { Lock } from "lucide-react";

export default function AdminGate({ children }: { children: React.ReactNode }) {
  const { authed, hasPass, login, setPassword, error } = useAdminAuth();
  const [pwd, setPwd] = useState("");
  const [pwd2, setPwd2] = useState("");
  const [sessionTimeout, setSessionTimeout] = useState(false);

  // Check if session is still valid
  useEffect(() => {
    const checkAuth = setInterval(() => {
      if (!authed) {
        setSessionTimeout(true);
      }
    }, 1000);

    return () => clearInterval(checkAuth);
  }, [authed]);

  if (authed) return <>{children}</>;

  return (
    <div className="min-h-[60vh] flex items-center justify-center bg-gradient-to-br from-black/5 to-black/10">
      <div className="w-full max-w-sm rounded-2xl border bg-card p-8 shadow-lg">
        <div className="flex items-center justify-center mb-6">
          <Lock className="h-8 w-8" />
        </div>
        <h1 className="text-2xl font-serif text-center mb-2">Admin Access</h1>
        <p className="text-xs text-center text-muted-foreground mb-6">
          Secure administration portal
        </p>

        {sessionTimeout && (
          <div className="mb-4 p-3 rounded-lg bg-yellow-50 border border-yellow-200">
            <p className="text-xs text-yellow-900">Session expired. Please log in again.</p>
          </div>
        )}

        {hasPass ? (
          <form
            className="space-y-4"
            onSubmit={async (e) => {
              e.preventDefault();
              const success = await login(pwd);
              if (success) {
                setPwd("");
                setSessionTimeout(false);
              }
            }}
          >
            <div>
              <label className="text-xs font-medium text-muted-foreground">Password</label>
              <Input
                type="password"
                placeholder="••••••••"
                value={pwd}
                onChange={(e) => setPwd(e.target.value)}
                required
                autoFocus
              />
            </div>
            {error && <p className="text-xs text-destructive font-medium">{error}</p>}
            <Button type="submit" className="w-full" disabled={!pwd}>
              Enter Admin Panel
            </Button>
            <p className="text-xs text-center text-muted-foreground">
              This session will expire after 30 minutes of inactivity.
            </p>
          </form>
        ) : (
          <form
            className="space-y-4"
            onSubmit={async (e) => {
              e.preventDefault();
              if (pwd !== pwd2) return;
              await setPassword(pwd);
            }}
          >
            <p className="text-sm text-muted-foreground rounded bg-blue-50 p-3 border border-blue-200">
              ⚠️ Set a strong admin password. This will be your only way to access the admin panel.
            </p>
            <div>
              <label className="text-xs font-medium text-muted-foreground">New Password</label>
              <Input
                type="password"
                placeholder="••••••••"
                value={pwd}
                onChange={(e) => setPwd(e.target.value)}
                required
                autoFocus
              />
            </div>
            <div>
              <label className="text-xs font-medium text-muted-foreground">Confirm Password</label>
              <Input
                type="password"
                placeholder="••••••••"
                value={pwd2}
                onChange={(e) => setPwd2(e.target.value)}
                required
              />
            </div>
            {pwd && pwd2 && pwd !== pwd2 && (
              <p className="text-xs text-destructive font-medium">Passwords do not match</p>
            )}
            {pwd && pwd.length < 8 && (
              <p className="text-xs text-yellow-700">Password should be at least 8 characters</p>
            )}
            <Button
              type="submit"
              className="w-full"
              disabled={!pwd || pwd !== pwd2 || pwd.length < 8}
            >
              Set Admin Password
            </Button>
            <p className="text-xs text-center text-muted-foreground">
              You'll need this password every time to access the admin panel. Store it securely.
            </p>
          </form>
        )}
      </div>
    </div>
  );
}
