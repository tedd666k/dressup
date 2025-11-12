import { Button } from "@/components/ui/button";

const PROMOS = [
  {
    title: "Bespoke Tailoring",
    subtitle: "Made-to-measure by Meya Karis",
    img: "https://images.pexels.com/photos/32100313/pexels-photo-32100313.jpeg",
  },
];

export default function PromoGrid() {
  return (
    <section className="container mx-auto py-12 md:py-16">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
        {PROMOS.map((p, i) => (
          <div key={i} className="group relative overflow-hidden rounded-2xl border bg-card">
            <img
              src={`${p.img}?auto=compress&cs=tinysrgb&w=2000`}
              alt={p.title}
              className="h-[360px] w-full object-cover transition-transform duration-700 group-hover:scale-[1.03]"
              loading="lazy"
            />
            <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/40 via-black/10 to-transparent" />
            <div className="absolute inset-0 flex items-end p-6">
              <div>
                <h3 className="text-white text-2xl md:text-3xl font-serif drop-shadow">{p.title}</h3>
                <p className="text-white/85 text-sm">{p.subtitle}</p>
                <div className="mt-3 pointer-events-auto">
                  <Button size="sm" variant="secondary">View</Button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
