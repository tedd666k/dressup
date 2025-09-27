import { Link } from "react-router-dom";

export default function Header() {
  return (
    <header className="sticky top-0 z-40 w-full border-b bg-background/80 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto flex h-16 items-center justify-between">
        <Link to="/" className="flex items-center gap-2">
          <span className="text-2xl font-semibold tracking-wide font-serif">Meya Karis</span>
        </Link>
        <div className="flex items-center gap-3">
          <a
            href="#collection"
            className="hidden sm:inline-flex text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            Collection
          </a>
          <a
            href="#about"
            className="hidden sm:inline-flex text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            About
          </a>
        </div>
      </div>
    </header>
  );
}
