import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useUser } from "@/hooks/useShop";
import { useState } from "react";

export default function Account() {
  const { user, register } = useUser();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");

  return (
    <div className="container mx-auto py-10 max-w-lg">
      <h1 className="text-2xl font-serif mb-4">Account</h1>
      {user.registered ? (
        <div className="rounded-xl border p-4">
          <p className="mb-2">Welcome! Your account is set.</p>
          <p className="text-sm text-muted-foreground">First-order discount: {user.discountAvailable ? "Available" : "Used"}</p>
        </div>
      ) : (
        <form className="space-y-3" onSubmit={(e)=>{e.preventDefault(); register();}}>
          <div>
            <Input placeholder="Full name" value={name} onChange={(e)=>setName(e.target.value)} required />
          </div>
          <div>
            <Input type="email" placeholder="Email" value={email} onChange={(e)=>setEmail(e.target.value)} required />
          </div>
          <Button type="submit">Create Account (get 10% off)</Button>
        </form>
      )}
    </div>
  );
}
