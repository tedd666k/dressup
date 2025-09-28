import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { cn } from "@/lib/utils";

export type GalleryImage = { src: string; alt: string };

export default function Gallery({ images }: { images: GalleryImage[] }) {
  const layout = [
    "md:col-span-6 md:row-span-2",
    "md:col-span-3 md:row-span-1",
    "md:col-span-3 md:row-span-1",
    "md:col-span-4 md:row-span-1",
    "md:col-span-4 md:row-span-1",
    "md:col-span-4 md:row-span-2",
    "md:col-span-8 md:row-span-1",
  ];

  return (
    <section className="py-8 md:py-14">
      <div className="relative left-1/2 right-1/2 -mx-[50vw] w-screen">
        <div className="grid grid-cols-2 md:grid-cols-12 auto-rows-[140px] md:auto-rows-[200px] gap-2 md:gap-3">
          {images.slice(0, 7).map((img, i) => (
            <Dialog key={i}>
              <DialogTrigger asChild>
                <button
                  className={cn(
                    "group relative overflow-hidden rounded-xl border bg-card",
                    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                    layout[i] ?? "md:col-span-4 md:row-span-1",
                  )}
                  aria-label="Open image"
                >
                  <img
                    src={`${img.src}?auto=compress&cs=tinysrgb&w=1600`}
                    alt={img.alt}
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                    loading="lazy"
                  />
                  <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                </button>
              </DialogTrigger>
              <DialogContent className="max-w-5xl p-0 overflow-hidden">
                <img
                  src={`${img.src}?auto=compress&cs=tinysrgb&w=2400`}
                  alt={img.alt}
                  className="w-full h-full object-contain bg-background"
                />
              </DialogContent>
            </Dialog>
          ))}
        </div>
      </div>
    </section>
  );
}
