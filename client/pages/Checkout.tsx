import { useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useShop, useUser } from "@/hooks/useShop";

export default function Checkout() {
  const { state, productsMap, clearCart } = useShop();
  const { user, consumeDiscount } = useUser();

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

  const handlePlaceOrder = () => {
    if (discount > 0) consumeDiscount();
    clearCart();
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
      <PaystackPayment total={total} items={state.cart} productsMap={productsMap} onSuccess={handlePlaceOrder} />
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
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState("");

  const handlePaystackPayment = async () => {
    if (!email.trim()) {
      alert("Please enter your email address");
      return;
    }

    setLoading(true);

    const itemsText = items
      .map((l) => {
        const p = productsMap.get(l.id)!;
        return `${p.name} x${l.qty}`;
      })
      .join(", ");

    const reference = `meya_${Date.now()}`;

    try {
      // Call backend to initialize payment
      const response = await fetch("/api/paystack/initialize", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          amount: total,
          reference,
          description: `Meya Karis Order: ${itemsText}`,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setLoading(false);
        alert(`Error: ${data.error || "Failed to initialize payment"}`);
        return;
      }

      // Initialize Paystack with the authorization URL
      const handler = (window as any).PaystackPop.setup({
        key: data.publicKey || "pk_live_8fb52479f7deb87da3914af4916b154e02584a7e",
        email: email,
        amount: Math.round(total * 100),
        currency: "GHS",
        ref: reference,
        onClose: () => {
          setLoading(false);
          alert("Payment window closed.");
        },
        onSuccess: async (response: any) => {
          // Verify payment with backend
          const verifyResponse = await fetch(`/api/paystack/verify?reference=${response.reference}`);
          const verifyData = await verifyResponse.json();

          setLoading(false);

          if (verifyData.verified) {
            alert(`Payment successful! Reference: ${response.reference}\n\nItems: ${itemsText}`);
            onSuccess();
          } else {
            alert("Payment verification failed. Please contact support.");
          }
        },
      });

      handler.openIframe();
    } catch (error) {
      setLoading(false);
      console.error("Payment error:", error);
      alert("Failed to process payment. Please try again.");
    }
  };

  return (
    <div className="mt-6 rounded-xl border p-4">
      <h3 className="font-medium mb-3">Payment Method</h3>
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
          {loading ? "Initializing Payment..." : `Pay ¢${total.toFixed(2)} with Paystack`}
        </Button>
        <p className="text-xs text-muted-foreground">
          Safe and secure payment powered by Paystack
        </p>
      </div>
    </div>
  );
}
