import { useEffect, useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import Gallery from "@/components/home/Gallery";
import { GALLERY_IMAGES } from "@/lib/gallery";
import HeroCarousel from "@/components/home/HeroCarousel";
import PromoGrid from "@/components/home/PromoGrid";
import Marquee from "@/components/home/Marquee";
import Newsletter from "@/components/home/Newsletter";
import SimpleProductGrid from "@/components/home/SimpleProductGrid";

export default function Index() {
  return (
    <div>
      <HeroCarousel />
      <section className="relative overflow-hidden">
        <div className="container mx-auto pt-14 pb-10 md:pt-14 md:pb-16">
          <div className="grid gap-10 md:grid-cols-2 md:items-center">
            <div>
              <h1 className="text-4xl md:text-6xl font-serif tracking-tight leading-[1.1]">Meya Karis</h1>
              <p className="mt-4 text-muted-foreground max-w-prose">
                Contemporary couture with timeless silhouettes. A refined, minimalist presentation.
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
              <SimpleProductGrid />
            </div>
          </div>
        </div>
      </section>

      {/* Gallery */}
      <Gallery images={GALLERY_IMAGES} />
      <PromoGrid />
      <Marquee />
      <Newsletter />

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
