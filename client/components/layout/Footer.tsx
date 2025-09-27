export default function Footer() {
  return (
    <footer className="border-t mt-20">
      <div className="container mx-auto py-8 text-sm text-muted-foreground flex flex-col sm:flex-row items-center justify-between gap-4">
        <p>© {new Date().getFullYear()} Meya Karis. All rights reserved.</p>
        <p className="opacity-80">Crafted with care.</p>
      </div>
    </footer>
  );
}
