import { GALLERY_IMAGES } from "@/lib/gallery";

export default function SimpleProductGrid() {
  const items = GALLERY_IMAGES.slice(0, 4);
  return (
    <div id="collection" className="grid grid-cols-2 gap-4">
      {items.map((img, i) => (
        <div key={i} className="group relative overflow-hidden rounded-xl border bg-card">
          <img
            src={`${img.src}?auto=compress&cs=tinysrgb&w=1600`}
            alt={img.alt}
            className="aspect-square w-full object-cover transition-transform duration-700 group-hover:scale-[1.03]"
            loading="lazy"
          />
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
        </div>
      ))}
    </div>
  );
}
