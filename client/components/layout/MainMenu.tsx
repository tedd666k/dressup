import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Menu } from "lucide-react";
import { Link } from "react-router-dom";
import { useState } from "react";

export default function MainMenu() {
  const [open, setOpen] = useState(false);

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <button
          aria-label="Open menu"
          className="inline-flex h-9 w-9 items-center justify-center rounded-md border bg-background hover:bg-accent/30"
        >
          <Menu className="h-4 w-4" />
        </button>
      </SheetTrigger>
      <SheetContent side="left" className="w-full sm:max-w-xs">
        <nav className="mt-8 grid gap-3 text-lg">
          <Link to="/" className="hover:underline" onClick={() => setOpen(false)}>
            Home
          </Link>
          <Link to="/collections" className="hover:underline" onClick={() => setOpen(false)}>
            Collection
          </Link>
          <Link to="/shop" className="hover:underline" onClick={() => setOpen(false)}>
            Shop
          </Link>
          <Link to="/about" className="hover:underline" onClick={() => setOpen(false)}>
            About
          </Link>
          <Link to="/cart" className="hover:underline" onClick={() => setOpen(false)}>
            Cart
          </Link>
        </nav>
      </SheetContent>
    </Sheet>
  );
}
