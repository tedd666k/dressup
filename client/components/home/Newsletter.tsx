import { FormEvent, useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export default function Newsletter() {
  const [email, setEmail] = useState("");
  const onSubmit = (e: FormEvent) => {
    e.preventDefault();
    setEmail("");
  };
  return (
    <section className="container mx-auto py-12 md:py-16">
      <div className="rounded-2xl border bg-card p-6 md:p-8 grid gap-4 md:grid-cols-[1fr_440px] items-center">
        <div>
          <h3 className="text-xl md:text-2xl font-serif">Join the list</h3>
          <p className="text-sm text-muted-foreground">Get early access to drops and events.</p>
        </div>
        <form onSubmit={onSubmit} className="flex gap-3">
          <Input type="email" required placeholder="you@example.com" value={email} onChange={(e) => setEmail(e.target.value)} />
          <Button type="submit">Subscribe</Button>
        </form>
      </div>
    </section>
  );
}
