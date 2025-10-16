import { useParams, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useShop, useSettings } from "@/hooks/useShop";
import { buildWhatsAppOrder } from "@/lib/wa";

declare global {
  interface Window {
    google: any;
  }
}

export default function ProductCheckout() {
  const { productId } = useParams();
  const navigate = useNavigate();
  const { state, productsMap } = useShop();
  const { settings } = useSettings();

  const product = productsMap.get(productId || "");

  const [name, setName] = useState("");
  const [address, setAddress] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [latitude, setLatitude] = useState<number | null>(null);
  const [longitude, setLongitude] = useState<number | null>(null);
  const [locationGranted, setLocationGranted] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!product) {
      navigate("/shop");
    }
  }, [product, navigate]);

  const requestLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLatitude(position.coords.latitude);
          setLongitude(position.coords.longitude);
          setLocationGranted(true);
          
          // Reverse geocode to get address (basic implementation)
          const geocodingUrl = `https://nominatim.openstreetmap.org/reverse?format=json&lat=${position.coords.latitude}&lon=${position.coords.longitude}`;
          fetch(geocodingUrl)
            .then(res => res.json())
            .then(data => {
              if (data.address) {
                const fullAddress = data.address.road || data.address.city || data.address.county || "";
                setAddress(fullAddress);
              }
            })
            .catch(err => console.log("Geocoding error:", err));
        },
        (error) => {
          console.log("Location error:", error);
          alert("Could not access your location. Please enter your address manually.");
        }
      );
    } else {
      alert("Geolocation is not supported by your browser.");
    }
  };

  const handlePlaceOrder = () => {
    if (!name.trim()) {
      alert("Please enter your name");
      return;
    }
    if (!address.trim()) {
      alert("Please enter your address");
      return;
    }
    if (!product) {
      return;
    }

    setLoading(true);

    const total = product.price * quantity;
    const locationInfo = locationGranted
      ? `%0ALocation: https://maps.google.com/?q=${latitude},${longitude}`
      : "";

    const orderText =
      `New Order from ${name}%0A` +
      `Address: ${encodeURIComponent(address)}%0A` +
      `Product: ${product.name} x${quantity}%0A` +
      `Price per item: ¢${product.price.toFixed(2)}%0A` +
      `Total: ¢${total.toFixed(2)}` +
      locationInfo +
      `%0A%0APlease confirm payment details.`;

    const waLink = buildWhatsAppOrder({
      phone: settings.ownerPhone,
      message: orderText,
    });

    if (waLink) {
      window.open(waLink, "_blank");
    }

    setLoading(false);
    setTimeout(() => navigate("/shop"), 1000);
  };

  if (!product) {
    return null;
  }

  const total = product.price * quantity;

  return (
    <div className="container mx-auto py-10">
      <h1 className="text-2xl font-serif mb-6">Order {product.name}</h1>

      <div className="grid md:grid-cols-2 gap-8">
        <div>
          <img
            src={`${product.image}?auto=compress&cs=tinysrgb&w=600`}
            alt={product.name}
            className="w-full rounded-xl mb-4"
          />
          <div className="rounded-xl border p-4 space-y-2">
            <p className="font-medium text-lg">{product.name}</p>
            <p className="text-sm text-muted-foreground">
              Price: ¢{product.price.toFixed(2)}
            </p>
            <div className="flex items-center gap-2 mt-4">
              <label className="text-sm font-medium">Quantity:</label>
              <Input
                type="number"
                min="1"
                max={product.stock}
                value={quantity}
                onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                className="w-20"
              />
              <span className="text-xs text-muted-foreground">
                {product.stock} available
              </span>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="rounded-xl border p-4">
            <h2 className="font-medium mb-4">Delivery Information</h2>
            <div className="space-y-3">
              <div>
                <label className="text-sm font-medium">Full Name</label>
                <Input
                  placeholder="Your name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </div>
              <div>
                <label className="text-sm font-medium">Delivery Address</label>
                <Input
                  placeholder="Your address"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                />
              </div>
              <Button
                variant="outline"
                onClick={requestLocation}
                className="w-full"
              >
                {locationGranted ? "✓ Location Granted" : "Allow Location Access"}
              </Button>
              {locationGranted && (
                <p className="text-xs text-green-700">
                  Your location ({latitude?.toFixed(4)}, {longitude?.toFixed(4)}) will be shared with the seller for delivery.
                </p>
              )}
            </div>
          </div>

          <div className="rounded-xl border p-4 space-y-2">
            <div className="flex items-center justify-between">
              <span>Item Price</span>
              <span>¢{product.price.toFixed(2)}</span>
            </div>
            <div className="flex items-center justify-between">
              <span>Quantity</span>
              <span>{quantity}</span>
            </div>
            <div className="border-t pt-2 flex items-center justify-between font-medium text-lg">
              <span>Total</span>
              <span>¢{total.toFixed(2)}</span>
            </div>
          </div>

          <div className="space-y-2">
            <Button
              size="lg"
              className="w-full"
              disabled={loading || !name || !address}
              onClick={handlePlaceOrder}
            >
              {loading ? "Processing..." : "Place Order via WhatsApp"}
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="w-full"
              onClick={() => navigate("/shop")}
              disabled={loading}
            >
              Continue Shopping
            </Button>
          </div>

          {!settings.ownerPhone && (
            <p className="text-xs text-muted-foreground rounded bg-yellow-50 p-3 border border-yellow-200">
              Admin needs to set WhatsApp number in settings for orders to work.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
