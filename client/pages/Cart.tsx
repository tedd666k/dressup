import { useMemo } from "react";
import { Button } from "@/components/ui/button";
import { useShop } from "@/hooks/useShop";
import { Link } from "react-router-dom";

export default function Cart() {
  const { state, productsMap, removeFromCart } = useShop();
  const total = useMemo(() => state.cart.reduce((sum, l) => sum + (productsMap.get(l.id)?.price || 0) * l.qty, 0), [state.cart, productsMap]);

  return (
    <div className="container mx-auto py-10">
      <h1 className="text-2xl font-serif mb-6">Your Cart</h1>
      <div className="space-y-4">
        {state.cart.length === 0 && <p className="text-muted-foreground">Your cart is empty.</p>}
        {state.cart.map((l) => {
          const p = productsMap.get(l.id)!;
          return (
            <div key={l.id} className="flex items-center justify-between border rounded-lg p-4">
              <div className="flex items-center gap-3">
                <img src={`${p.image}?auto=compress&cs=tinysrgb&w=200`} className="h-16 w-12 object-cover rounded" />
                <div>
                  <p className="font-medium">{p.name}</p>
                  <p className="text-xs text-muted-foreground">Qty {l.qty}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <p>¢{(p.price * l.qty).toFixed(2)}</p>
                <Button variant="outline" size="sm" onClick={() => removeFromCart(l.id)}>Remove</Button>
              </div>
            </div>
          );
        })}
      </div>
      <div className="mt-6 flex items-center justify-between">
        <p className="text-lg">Total: <strong>¢{total.toFixed(2)}</strong></p>
        <div className="flex gap-3">
          <Link to="/shop"><Button variant="outline">Continue Shopping</Button></Link>
          <Link to="/checkout"><Button disabled={state.cart.length===0}>Checkout</Button></Link>
        </div>
      </div>
    </div>
  );
}
