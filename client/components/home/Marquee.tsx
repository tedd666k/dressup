export default function Marquee() {
  const items = Array.from({ length: 8 }).map((_, i) => (
    <span key={i} className="mx-6 whitespace-nowrap">Meya Karis • Atelier</span>
  ));
  return (
    <section className="relative py-6 md:py-8">
      <div className="relative left-1/2 right-1/2 -mx-[50vw] w-screen overflow-hidden border-y bg-background/60">
        <div className="flex items-center text-sm md:text-base tracking-wide text-muted-foreground [animation:marquee_24s_linear_infinite] hover:[animation-play-state:paused]">
          {items}
          {items}
          {items}
        </div>
      </div>
      <style>{`@keyframes marquee{0%{transform:translateX(0)}100%{transform:translateX(-50%)}}`}</style>
    </section>
  );
}
