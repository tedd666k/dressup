import { useShop } from "@/hooks/useShop";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { useState, useMemo } from "react";
import ProductCard from "@/components/shop/ProductCard";

export default function Collections() {
  const { state, addToCart } = useShop();
  const [selectedCollectionId, setSelectedCollectionId] = useState<string | null>(null);

  const selectedCollection = useMemo(() => {
    return state.collections.find((c) => c.id === selectedCollectionId);
  }, [state.collections, selectedCollectionId]);

  const filteredProducts = useMemo(() => {
    if (!selectedCollectionId) {
      return state.products;
    }
    return state.products;
  }, [state.products, selectedCollectionId]);

  return (
    <div className="container mx-auto py-10">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-serif">Collections</h1>
        <Link to="/cart">
          <Button variant="outline">
            Cart ({state.cart.reduce((a, b) => a + b.qty, 0)})
          </Button>
        </Link>
      </div>

      {state.collections.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-muted-foreground mb-4">No collections yet.</p>
          <Link to="/shop">
            <Button>Browse Shop</Button>
          </Link>
        </div>
      ) : (
        <div className="space-y-12">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
            {state.collections.map((c) => (
              <button
                key={c.id}
                onClick={() => setSelectedCollectionId(c.id)}
                className={`group relative overflow-hidden rounded-2xl border transition-all cursor-pointer h-full ${
                  selectedCollectionId === c.id
                    ? "ring-2 ring-black"
                    : "bg-card hover:border-black"
                }`}
              >
                {c.images[0] && (
                  <img
                    src={`${c.images[0]}?auto=compress&cs=tinysrgb&w=2000`}
                    alt={c.name}
                    className="h-[360px] w-full object-cover transition-transform duration-700 group-hover:scale-[1.03]"
                    loading="lazy"
                  />
                )}
                <div className="absolute inset-0 flex items-end p-6">
                  <div className="text-left">
                    <h3 className="text-white text-2xl md:text-3xl font-serif drop-shadow">
                      {c.name}
                    </h3>
                    <p className="text-white/85 text-sm">
                      {c.images.length} image{c.images.length === 1 ? "" : "s"}
                    </p>
                  </div>
                </div>
                <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/40 via-black/10 to-transparent" />
              </button>
            ))}
          </div>

          {selectedCollection && (
            <div>
              <div className="mb-8">
                <h2 className="text-xl font-serif mb-2">{selectedCollection.name}</h2>
                <button
                  onClick={() => setSelectedCollectionId(null)}
                  className="text-sm text-muted-foreground hover:text-foreground"
                >
                  View All Collections
                </button>
              </div>
              {filteredProducts.length === 0 ? (
                <div className="text-center py-12">
                  <p className="text-muted-foreground">No products available.</p>
                </div>
              ) : (
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-6">
                  {filteredProducts.map((p) => (
                    <ProductCard
                      key={p.id}
                      p={p}
                      onAdd={() => addToCart(p.id, 1)}
                    />
                  ))}
                </div>
              )}
            </div>
          )}

          {!selectedCollectionId && (
            <div>
              <h2 className="text-xl font-serif mb-6">All Products</h2>
              {filteredProducts.length === 0 ? (
                <div className="text-center py-12">
                  <p className="text-muted-foreground">No products available.</p>
                </div>
              ) : (
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-6">
                  {filteredProducts.map((p) => (
                    <ProductCard
                      key={p.id}
                      p={p}
                      onAdd={() => addToCart(p.id, 1)}
                    />
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
