import { useMemo } from "react";
import { Button } from "@/components/ui/button";
import { useShop, useUser, useSettings } from "@/hooks/useShop";
import { buildWhatsAppOrder } from "@/lib/wa";

export default function Checkout() {
  const { state, productsMap, clearCart } = useShop();
  const { user, consumeDiscount } = useUser();
  const { settings } = useSettings();

  const subtotal = useMemo(() => state.cart.reduce((sum, l) => sum + (productsMap.get(l.id)?.price || 0) * l.qty, 0), [state.cart, productsMap]);
  const discount = user.registered && user.discountAvailable ? subtotal * 0.1 : 0;
  const total = Math.max(0, subtotal - discount);

  const orderText = useMemo(() => {
    const lines = state.cart.map((l) => {
      const p = productsMap.get(l.id)!; return `• ${p.name} x${l.qty} — ¢${(p.price*l.qty).toFixed(2)}`;
    }).join("%0A");
    return `New Order — Meya Karis%0A${lines}%0ASubtotal: ¢${subtotal.toFixed(2)}%0A${discount>0?`Discount (first order 10%): -¢${discount.toFixed(2)}%0A`:""}Total: ¢${total.toFixed(2)}%0A`;
  }, [state.cart, productsMap, subtotal, discount, total]);

  const waLink = buildWhatsAppOrder({ phone: settings.ownerPhone, message: orderText + "Please confirm Mobile Money payment details." });

  const handlePlaceOrder = () => {
    if (discount > 0) consumeDiscount();
    clearCart();
    if (waLink) window.open(waLink, "_blank");
  };

  return (
    <div className="container mx-auto py-10">
      <h1 className="text-2xl font-serif mb-2">Checkout</h1>
      <p className="text-sm text-muted-foreground mb-6">Ghana Mobile Money supported (setup required). Order details will be sent to WhatsApp.</p>
      <div className="rounded-xl border p-4 space-y-2">
        <div className="flex items-center justify-between"><span>Subtotal</span><span>¢{subtotal.toFixed(2)}</span></div>
        {discount>0 && <div className="flex items-center justify-between text-green-700"><span>First order discount (10%)</span><span>-¢{discount.toFixed(2)}</span></div>}
        <div className="flex items-center justify-between font-medium"><span>Total</span><span>¢{total.toFixed(2)}</span></div>
      </div>
      <div className="mt-6 flex flex-col sm:flex-row gap-3">
        <Button disabled={!waLink} onClick={handlePlaceOrder}>Place Order via WhatsApp</Button>
        <Button variant="outline" disabled className="cursor-not-allowed">Pay with Mobile Money (connect Paystack/Flutterwave)</Button>
      </div>
      {!settings.ownerPhone && <p className="mt-3 text-xs text-muted-foreground">Set owner WhatsApp in Admin → Settings to enable WhatsApp ordering.</p>}
    </div>
  );
}
