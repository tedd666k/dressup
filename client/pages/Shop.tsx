import ProductCard from "@/components/shop/ProductCard";
import { useShop } from "@/hooks/useShop";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

export default function Shop() {
  const { state, addToCart } = useShop();
  return (
    <div className="container mx-auto py-10">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-serif">Shop</h1>
        <Link to="/cart"><Button variant="outline">Cart ({state.cart.reduce((a, b) => a + b.qty, 0)})</Button></Link>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-6">
        {state.products.map((p) => (
          <ProductCard key={p.id} p={p} onAdd={() => addToCart(p.id, 1)} />
        ))}
      </div>
    </div>
  );
}
