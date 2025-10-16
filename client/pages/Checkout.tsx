import { useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useShop, useUser, useSettings } from "@/hooks/useShop";
import { buildWhatsAppOrder } from "@/lib/wa";

export default function Checkout() {
  const { state, productsMap, clearCart } = useShop();
  const { user, consumeDiscount } = useUser();
  const { settings } = useSettings();

  const subtotal = useMemo(
    () =>
      state.cart.reduce(
        (sum, l) => sum + (productsMap.get(l.id)?.price || 0) * l.qty,
        0,
      ),
    [state.cart, productsMap],
  );
  const discount =
    user.registered && user.discountAvailable ? subtotal * 0.1 : 0;
  const total = Math.max(0, subtotal - discount);

  const orderText = useMemo(() => {
    const lines = state.cart
      .map((l) => {
        const p = productsMap.get(l.id)!;
        return `• ${p.name} x${l.qty} — ¢${(p.price * l.qty).toFixed(2)}`;
      })
      .join("%0A");
    return `New Order — Meya Karis%0A${lines}%0ASubtotal: ¢${subtotal.toFixed(2)}%0A${discount > 0 ? `Discount (first order 10%): -¢${discount.toFixed(2)}%0A` : ""}Total: ¢${total.toFixed(2)}%0A`;
  }, [state.cart, productsMap, subtotal, discount, total]);

  const waLink = buildWhatsAppOrder({
    phone: settings.ownerPhone,
    message: orderText + "Please confirm Mobile Money payment details.",
  });

  const handlePlaceOrder = () => {
    if (discount > 0) consumeDiscount();
    clearCart();
    if (waLink) window.open(waLink, "_blank");
  };

  return (
    <div className="container mx-auto py-10">
      <h1 className="text-2xl font-serif mb-2">Checkout</h1>
      <p className="text-sm text-muted-foreground mb-6">
        Ghana Mobile Money supported. Orders send to WhatsApp.
      </p>
      <div className="rounded-xl border p-4 space-y-2">
        <div className="flex items-center justify-between">
          <span>Subtotal</span>
          <span>¢{subtotal.toFixed(2)}</span>
        </div>
        {discount > 0 && (
          <div className="flex items-center justify-between text-green-700">
            <span>First order discount (10%)</span>
            <span>-¢{discount.toFixed(2)}</span>
          </div>
        )}
        <div className="flex items-center justify-between font-medium">
          <span>Total</span>
          <span>¢{total.toFixed(2)}</span>
        </div>
      </div>
      {settings.momoProvider === "paystack" && settings.paystackKey ? (
        <PaystackPayment total={total} items={state.cart} productsMap={productsMap} onSuccess={handlePlaceOrder} />
      ) : settings.momoProvider === "manual" ? (
        <ManualMomo orderText={orderText} ownerPhone={settings.ownerPhone} />
      ) : (
        <div className="mt-6 flex flex-col sm:flex-row gap-3">
          <Button disabled={!waLink} onClick={handlePlaceOrder}>
            Place Order via WhatsApp
          </Button>
          <Button variant="outline" disabled className="cursor-not-allowed">
            Pay with Mobile Money (configure in admin)
          </Button>
        </div>
      )}
      {!settings.ownerPhone && (
        <p className="mt-3 text-xs text-muted-foreground">
          Set owner WhatsApp in Admin → Settings to enable WhatsApp ordering.
        </p>
      )}
    </div>
  );
}

function PaystackPayment({
  total,
  items,
  productsMap,
  onSuccess,
}: {
  total: number;
  items: any[];
  productsMap: Map<string, any>;
  onSuccess: () => void;
}) {
  const { settings } = useSettings();
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState("");

  const handlePaystackPayment = () => {
    if (!email.trim()) {
      alert("Please enter your email address");
      return;
    }

    setLoading(true);
    const amount = Math.round(total * 100);

    const itemsText = items
      .map((l) => {
        const p = productsMap.get(l.id)!;
        return `${p.name} x${l.qty}`;
      })
      .join(", ");

    const handler = (window as any).PaystackPop.setup({
      key: settings.paystackKey,
      email: email,
      amount: amount,
      currency: "GHS",
      ref: `meya_${Date.now()}`,
      onClose: () => {
        setLoading(false);
        alert("Payment window closed.");
      },
      onSuccess: (response: any) => {
        setLoading(false);
        alert(`Payment successful! Reference: ${response.reference}\n\nItems: ${itemsText}`);
        onSuccess();
      },
    });

    handler.openIframe();
  };

  return (
    <div className="mt-6 rounded-xl border p-4">
      <h3 className="font-medium mb-3">Pay with Paystack</h3>
      <div className="space-y-3">
        <div>
          <label className="text-sm font-medium">Email Address</label>
          <Input
            type="email"
            placeholder="your@email.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            disabled={loading}
          />
        </div>
        <Button
          className="w-full"
          disabled={loading || !email}
          onClick={handlePaystackPayment}
        >
          {loading ? "Processing..." : `Pay ¢${total.toFixed(2)} with Paystack`}
        </Button>
      </div>
    </div>
  );
}

function ManualMomo({
  orderText,
  ownerPhone,
}: {
  orderText: string;
  ownerPhone?: string;
}) {
  const [phone, setPhone] = useState("");
  const [network, setNetwork] = useState("MTN");
  const link = buildWhatsAppOrder({
    phone: ownerPhone,
    message: `${orderText}MoMo request — Network: ${network}, Customer MoMo: ${phone}`,
  });
  return (
    <div className="mt-6 rounded-xl border p-4">
      <h3 className="font-medium mb-3">Mobile Money (Manual)</h3>
      <div className="grid md:grid-cols-3 gap-3">
        <Input
          placeholder="Customer MoMo Number"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
        />
        <select
          className="h-10 rounded-md border bg-background px-3"
          value={network}
          onChange={(e) => setNetwork(e.target.value)}
        >
          <option>MTN</option>
          <option>Vodafone</option>
          <option>AirtelTigo</option>
        </select>
        <Button
          disabled={!link}
          onClick={() => link && window.open(link, "_blank")}
        >
          Send Payment Request via WhatsApp
        </Button>
      </div>
      {!ownerPhone && (
        <p className="mt-2 text-xs text-muted-foreground">
          Set owner WhatsApp in Admin → Settings.
        </p>
      )}
    </div>
  );
}
