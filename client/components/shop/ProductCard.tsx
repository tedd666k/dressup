import { Button } from "@/components/ui/button";
import { Product } from "@/lib/products";

export default function ProductCard({ p, onAdd }: { p: Product; onAdd: () => void }) {
  const soldOut = p.stock <= 0;
  return (
    <div className="group rounded-xl border bg-card overflow-hidden">
      <img src={`${p.image}?auto=compress&cs=tinysrgb&w=1200`} alt={p.name} className="aspect-[3/4] w-full object-cover" loading="lazy" />
      <div className="p-4 flex items-center justify-between gap-3">
        <div>
          <p className="font-medium">{p.name}</p>
          <p className="text-xs text-muted-foreground">{soldOut ? "Sold out" : `${p.stock} left`}</p>
        </div>
        <div className="text-right">
          <p className="text-sm">¢{p.price.toFixed(2)}</p>
          <Button size="sm" disabled={soldOut} onClick={onAdd} className="mt-2">Add</Button>
        </div>
      </div>
    </div>
  );
}
