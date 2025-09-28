import { useEffect, useMemo, useState } from "react";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import SamplePreview from "@/components/home/SamplePreview";
import ModelViewer from "@/components/3d/ModelViewer";
import { SAMPLES, type Sample } from "@/lib/samples";
import Gallery from "@/components/home/Gallery";
import { GALLERY_IMAGES } from "@/lib/gallery";

export default function Index() {
  const [selected, setSelected] = useState<Sample | null>(null);
  const [highlight, setHighlight] = useState(0);

  useEffect(() => {
    const id = setInterval(() => setHighlight((h) => (h + 1) % samples.length), 5000);
    return () => clearInterval(id);
  }, []);

  const samples = useMemo(() => SAMPLES, []);

  return (
    <div>
      <section className="relative overflow-hidden">
        <div className="container mx-auto pt-14 pb-10 md:pt-20 md:pb-16">
          <div className="grid gap-10 md:grid-cols-2 md:items-center">
            <div>
              <h1 className="text-4xl md:text-6xl font-serif tracking-tight leading-[1.1]">Meya Karis</h1>
              <p className="mt-4 text-muted-foreground max-w-prose">
                Contemporary couture with timeless silhouettes. Explore crafted garments in an immersive 3D view.
              </p>
              <div className="mt-6 flex gap-3">
                <a href="#collection">
                  <Button className="">View Collection</Button>
                </a>
                <a href="#about">
                  <Button variant="outline">About</Button>
                </a>
              </div>
            </div>
            <div className="relative">
              <div className="grid grid-cols-2 gap-4" id="collection">
                {samples.map((s, i) => (
                  <Dialog key={s.id}>
                    <DialogTrigger asChild>
                      <button
                        onClick={() => setSelected(s)}
                        className={`group text-left rounded-xl p-3 transition-all border hover:shadow-lg ${
                          i === highlight ? "ring-2 ring-accent/70" : ""
                        }`}
                        aria-label={`Open ${s.name}`}
                      >
                        <SamplePreview color={s.color} accent={s.accent} variant={s.variant} bg={s.bg} />
                        <div className="mt-3 flex items-center justify-between">
                          <div>
                            <p className="font-medium">{s.name}</p>
                            <p className="text-xs text-muted-foreground">Interactive 3D preview</p>
                          </div>
                          <span className="text-xs px-2 py-1 rounded-full border bg-muted">3D</span>
                        </div>
                      </button>
                    </DialogTrigger>
                    <DialogContent className="max-w-3xl p-0">
                      {selected && (
                        <div className="w-full">
                          <div className="px-4 pt-4"><h3 className="text-lg font-medium">{selected.name}</h3></div>
                          <ModelViewer color={selected.color} accent={selected.accent} variant={selected.variant} bg={selected.bg} />
                        </div>
                      )}
                    </DialogContent>
                  </Dialog>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Gallery */}
      <Gallery images={GALLERY_IMAGES} />

      <section id="about" className="container mx-auto py-16 md:py-24">
        <div className="max-w-2xl">
          <h2 className="text-2xl md:text-3xl font-serif">Elegance, Reimagined</h2>
          <p className="mt-3 text-muted-foreground">
            Each piece is sculpted with consideration for movement and form. Rotate garments, inspect details, and experience the silhouette before it arrives.
          </p>
        </div>
      </section>
    </div>
  );
}
