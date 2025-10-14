import { Link } from "react-router-dom";
import MainMenu from "@/components/layout/MainMenu";

export default function Header() {
  return (
    <header className="sticky top-0 z-40 w-full border-b bg-background/70 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="w-full bg-black text-white text-xs py-2 text-center tracking-wide">
        New drop — limited pieces available now
      </div>
      <div className="container mx-auto grid h-16 grid-cols-3 items-center">
        <div className="flex items-center gap-3">
          <MainMenu />
        </div>
        <div className="flex items-center justify-center">
          <Link to="/" className="flex items-center gap-2">
            <span className="text-2xl font-semibold tracking-wide font-serif">Meya Karis</span>
          </Link>
        </div>
        <div className="flex items-center justify-end gap-3">
          <a href="#about" className="text-sm text-muted-foreground hover:text-foreground transition-colors">About</a>
        </div>
      </div>
    </header>
  );
}
