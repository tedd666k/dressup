import { Link } from "react-router-dom";
import { cn } from "@/lib/utils";
import { ShoppingBag } from "lucide-react";

export default function WhatsAppPopup({ className }: { className?: string }) {
  return (
    <div className={cn("fixed bottom-6 right-6 z-50", className)}>
      <Link to="/shop">
        <button
          className="inline-flex items-center gap-2 rounded-full border bg-background/80 backdrop-blur px-4 py-2 shadow-lg hover:shadow-xl transition-all text-sm"
          aria-label="Go to shop"
        >
          <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-black text-white shadow-sm">
            <ShoppingBag className="h-4 w-4" />
          </span>
          <span className="pr-1">Shop</span>
        </button>
      </Link>
    </div>
  );
}
