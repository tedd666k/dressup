import useEmblaCarousel, { EmblaOptionsType, EmblaCarouselType } from "embla-carousel-react";
import { useCallback, useEffect, useRef } from "react";

const HERO_IMAGES = [
  "https://images.pexels.com/photos/25650913/pexels-photo-25650913.jpeg",
  "https://images.pexels.com/photos/32486448/pexels-photo-32486448.jpeg",
  "https://images.pexels.com/photos/32100313/pexels-photo-32100313.jpeg",
];

export default function HeroCarousel({
  height = "h-[62vh] md:h-[72vh]",
  options,
}: { height?: string; options?: EmblaOptionsType }) {
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true, ...options });
  const timer = useRef<number | null>(null);

  const play = useCallback((api: EmblaCarouselType | null) => {
    if (!api) return;
    stop();
    timer.current = window.setInterval(() => api.scrollNext(), 4500);
  }, []);

  const stop = useCallback(() => {
    if (timer.current) {
      clearInterval(timer.current);
      timer.current = null;
    }
  }, []);

  useEffect(() => {
    if (!emblaApi) return;
    play(emblaApi);
    emblaApi.on("pointerDown", () => stop());
    emblaApi.on("pointerUp", () => play(emblaApi));
    return () => stop();
  }, [emblaApi, play, stop]);

  return (
    <section className="relative">
      <div className={`relative w-full overflow-hidden ${height}`} ref={emblaRef}>
        <div className="flex h-full">
          {HERO_IMAGES.map((src, i) => (
            <div className="relative min-w-0 flex-[0_0_100%] h-full" key={i}>
              <img
                src={`${src}?auto=compress&cs=tinysrgb&w=2000`}
                alt="Hero"
                className="absolute inset-0 h-full w-full object-cover"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/35 via-black/10 to-transparent" />
            </div>
          ))}
        </div>
      </div>
      <div className="pointer-events-none absolute inset-0 flex items-end justify-center pb-10">
        <div className="text-center text-white">
          <h2 className="text-3xl md:text-5xl font-serif tracking-tight drop-shadow">New Arrivals</h2>
          <p className="mt-2 text-sm md:text-base opacity-90">Discover the latest from Meya Karis</p>
        </div>
      </div>
    </section>
  );
}
