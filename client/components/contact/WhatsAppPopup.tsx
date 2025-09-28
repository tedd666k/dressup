import { useEffect, useMemo, useState } from "react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { MessageCircle } from "lucide-react";

type WhatsAppConfig = { phone?: string; message?: string };

const STORAGE_KEY = "meya.whatsapp";

function loadConfig(): WhatsAppConfig {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as WhatsAppConfig) : {};
  } catch {
    return {};
  }
}

function saveConfig(cfg: WhatsAppConfig) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(cfg));
}

function buildWaLink(cfg: WhatsAppConfig) {
  const phone = (cfg.phone || "").replace(/[^\d]/g, "");
  const msg = cfg.message || "Hello, I'm interested in Meya Karis.";
  if (!phone) return null;
  return `https://wa.me/${phone}?text=${encodeURIComponent(msg)}`;
}

export default function WhatsAppPopup({ className }: { className?: string }) {
  const [open, setOpen] = useState(false);
  const [cfg, setCfg] = useState<WhatsAppConfig>({});
  const [phone, setPhone] = useState("");
  const [message, setMessage] = useState("");

  useEffect(() => {
    const c = loadConfig();
    setCfg(c);
    setPhone(c.phone || "");
    setMessage(c.message || "Hello, I'm interested in Meya Karis.");
  }, []);

  const link = useMemo(() => buildWaLink({ phone, message }), [phone, message]);
  const hasConfigured = !!cfg.phone;

  const handleStart = () => {
    if (!phone) return;
    const next = { phone, message };
    saveConfig(next);
    setCfg(next);
    const href = buildWaLink(next);
    if (href) window.open(href, "_blank");
    setOpen(false);
  };

  return (
    <div className={cn("fixed bottom-6 right-6 z-50", className)}>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <button
            className="group inline-flex items-center gap-2 rounded-full border bg-background/80 backdrop-blur px-4 py-2 shadow-lg hover:shadow-xl transition-all text-sm"
            aria-label="WhatsApp contact"
          >
            <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-[#25D366] text-white shadow-sm">
              <MessageCircle className="h-4 w-4" />
            </span>
            <span className="pr-1">WhatsApp</span>
          </button>
        </PopoverTrigger>
        <PopoverContent align="end" className="w-80">
          {hasConfigured ? (
            <div className="space-y-3">
              <p className="text-sm text-muted-foreground">You're set up. Tap below to open WhatsApp, or edit details.</p>
              <div className="grid gap-2">
                <Button onClick={() => { const href = buildWaLink({ phone: cfg.phone, message: cfg.message }); if (href) window.open(href, "_blank"); }}>Open WhatsApp</Button>
                <Button variant="outline" onClick={() => setCfg({})}>Edit setup</Button>
              </div>
            </div>
          ) : (
            <div className="space-y-3">
              <div className="space-y-1">
                <Label htmlFor="wa-phone">Phone (with country code)</Label>
                <Input id="wa-phone" placeholder="e.g. +2348012345678" value={phone} onChange={(e) => setPhone(e.target.value)} />
              </div>
              <div className="space-y-1">
                <Label htmlFor="wa-msg">Default message</Label>
                <Input id="wa-msg" value={message} onChange={(e) => setMessage(e.target.value)} />
              </div>
              <Button disabled={!phone} onClick={handleStart}>Save & Open WhatsApp</Button>
              <p className="text-xs text-muted-foreground">Tip: Saved locally for this browser only.</p>
            </div>
          )}
        </PopoverContent>
      </Popover>
    </div>
  );
}
