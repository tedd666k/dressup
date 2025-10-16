import ProductCard from "@/components/shop/ProductCard";
import { useShop } from "@/hooks/useShop";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { useState, useMemo } from "react";

export default function Shop() {
  const { state, addToCart } = useShop();
  const [selectedCategory, setSelectedCategory] = useState<"dresses" | "skirts">("dresses");
  const [selectedSize, setSelectedSize] = useState<string | null>(null);

  const allSizes = useMemo(() => {
    const sizes = new Set<string>();
    state.products.forEach((p) => {
      if (p.category === selectedCategory) {
        p.sizes.forEach((s) => sizes.add(s));
      }
    });
    return Array.from(sizes).sort((a, b) => {
      const order = ["XS", "S", "M", "L", "XL", "XXL"];
      return order.indexOf(a) - order.indexOf(b);
    });
  }, [state.products, selectedCategory]);

  const filteredProducts = useMemo(() => {
    return state.products.filter((p) => {
      const categoryMatch = p.category === selectedCategory;
      const sizeMatch = !selectedSize || p.sizes.includes(selectedSize);
      return categoryMatch && sizeMatch;
    });
  }, [state.products, selectedCategory, selectedSize]);

  return (
    <div className="container mx-auto py-10">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-serif">Shop</h1>
        <Link to="/cart">
          <Button variant="outline">
            Cart ({state.cart.reduce((a, b) => a + b.qty, 0)})
          </Button>
        </Link>
      </div>

      <div className="mb-8 space-y-6">
        <div>
          <h2 className="font-medium mb-4">Category</h2>
          <div className="flex gap-3">
            {["dresses", "skirts"].map((cat) => (
              <button
                key={cat}
                onClick={() => {
                  setSelectedCategory(cat as "dresses" | "skirts");
                  setSelectedSize(null);
                }}
                className={`px-6 py-2 rounded-lg font-medium transition-colors capitalize ${
                  selectedCategory === cat
                    ? "bg-black text-white"
                    : "bg-gray-100 text-foreground hover:bg-gray-200"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        <div>
          <h2 className="font-medium mb-4">Size</h2>
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setSelectedSize(null)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                selectedSize === null
                  ? "bg-black text-white"
                  : "bg-gray-100 text-foreground hover:bg-gray-200"
              }`}
            >
              All Sizes
            </button>
            {allSizes.map((size) => (
              <button
                key={size}
                onClick={() => setSelectedSize(size)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  selectedSize === size
                    ? "bg-black text-white"
                    : "bg-gray-100 text-foreground hover:bg-gray-200"
                }`}
              >
                {size}
              </button>
            ))}
          </div>
        </div>
      </div>

      {filteredProducts.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-muted-foreground">
            No products found in this category with the selected size.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-6">
          {filteredProducts.map((p) => (
            <ProductCard key={p.id} p={p} onAdd={() => addToCart(p.id, 1)} />
          ))}
        </div>
      )}
    </div>
  );
}
