import { useShop } from "@/hooks/useShop";
import { Link } from "react-router-dom";

export default function HomeCollections() {
  const { state } = useShop();
  if (!state.collections.length) return null;
  return (
    <section id="collections" className="container mx-auto py-10 md:py-14">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
        {state.collections.map((c) => (
          <Link key={c.id} to={`/collection/${c.id}`}>
            <div className="group relative overflow-hidden rounded-2xl border bg-card cursor-pointer h-full">
              {c.images[0] && (
                <img src={`${c.images[0]}?auto=compress&cs=tinysrgb&w=2000`} alt={c.name} className="h-[360px] w-full object-cover transition-transform duration-700 group-hover:scale-[1.03]" loading="lazy" />
              )}
              <div className="absolute inset-0 flex items-end p-6">
                <div>
                  <h3 className="text-white text-2xl md:text-3xl font-serif drop-shadow">{c.name}</h3>
                  <p className="text-white/85 text-sm">{c.images.length} image{c.images.length===1?"":"s"}</p>
                </div>
              </div>
              <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/40 via-black/10 to-transparent" />
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
