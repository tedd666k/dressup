import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Menu } from "lucide-react";
import { Link } from "react-router-dom";

export default function MainMenu() {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <button aria-label="Open menu" className="inline-flex h-9 w-9 items-center justify-center rounded-md border bg-background hover:bg-accent/30">
          <Menu className="h-4 w-4" />
        </button>
      </SheetTrigger>
      <SheetContent side="left" className="w-full sm:max-w-xs">
        <nav className="mt-8 grid gap-3 text-lg">
          <a href="#collection" className="hover:underline">Collections</a>
          <a href="#gallery" className="hover:underline">Gallery</a>
          <a href="#about" className="hover:underline">About</a>
          <a href="#contact" className="hover:underline">Contact</a>
          <Link to="/" className="mt-4 text-sm text-muted-foreground hover:text-foreground">Home</Link>
        </nav>
      </SheetContent>
    </Sheet>
  );
}
