import { useEffect, useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import HeroCarousel from "@/components/home/HeroCarousel";
import PromoGrid from "@/components/home/PromoGrid";
import Newsletter from "@/components/home/Newsletter";
import SimpleProductGrid from "@/components/home/SimpleProductGrid";
import HomeCollections from "@/components/home/HomeCollections";

export default function Index() {
  return (
    <div>
      <HeroCarousel />
      <section className="relative overflow-hidden">
        <div className="container mx-auto pt-14 pb-10 md:pt-14 md:pb-16">
          <div className="grid gap-10 md:grid-cols-2 md:items-center">
            <div>
              <img src="https://cdn.builder.io/api/v1/image/assets%2F97defe09b2e246bca7c6b4af0eddc0c2%2F286f3bb2c7bb4a4caca0aa5c35bfb8d5?format=webp&width=800" alt="Meya Karis" className="h-24 w-auto mb-6 bg-gray-100 rounded-lg p-3" />
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

      {/* Collections (auto from Admin) */}
      <HomeCollections />
      <PromoGrid />
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
