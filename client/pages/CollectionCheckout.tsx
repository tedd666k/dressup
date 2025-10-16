import { useParams, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useShop, useSettings } from "@/hooks/useShop";
import { buildWhatsAppOrder } from "@/lib/wa";

export default function CollectionCheckout() {
  const { collectionId } = useParams();
  const navigate = useNavigate();
  const { state, settings: shopSettings } = useShop();
  const { settings } = useSettings();

  const collection = state.collections.find((c) => c.id === collectionId);

  const [name, setName] = useState("");
  const [address, setAddress] = useState("");
  const [latitude, setLatitude] = useState<number | null>(null);
  const [longitude, setLongitude] = useState<number | null>(null);
  const [locationGranted, setLocationGranted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [selectedImage, setSelectedImage] = useState(0);

  useEffect(() => {
    if (!collection) {
      navigate("/");
    }
  }, [collection, navigate]);

  const requestLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLatitude(position.coords.latitude);
          setLongitude(position.coords.longitude);
          setLocationGranted(true);

          const geocodingUrl = `https://nominatim.openstreetmap.org/reverse?format=json&lat=${position.coords.latitude}&lon=${position.coords.longitude}`;
          fetch(geocodingUrl)
            .then((res) => res.json())
            .then((data) => {
              if (data.address) {
                const fullAddress =
                  data.address.road || data.address.city || data.address.county || "";
                setAddress(fullAddress);
              }
            })
            .catch((err) => console.log("Geocoding error:", err));
        },
        (error) => {
          console.log("Location error:", error);
          alert(
            "Could not access your location. Please enter your address manually."
          );
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
    if (!collection) {
      return;
    }

    setLoading(true);

    const locationInfo = locationGranted
      ? `%0ALocation: https://maps.google.com/?q=${latitude},${longitude}`
      : "";

    const orderText =
      `New Collection Order from ${name}%0A` +
      `Address: ${encodeURIComponent(address)}%0A` +
      `Collection: ${collection.name}%0A` +
      `Images: ${collection.images.length}` +
      locationInfo +
      `%0A%0APlease confirm payment details and send collection details.`;

    const waLink = buildWhatsAppOrder({
      phone: settings.ownerPhone,
      message: orderText,
    });

    if (waLink) {
      window.open(waLink, "_blank");
    }

    setLoading(false);
    setTimeout(() => navigate("/"), 1000);
  };

  if (!collection) {
    return null;
  }

  return (
    <div className="container mx-auto py-10">
      <h1 className="text-2xl font-serif mb-6">Order {collection.name}</h1>

      <div className="grid md:grid-cols-2 gap-8">
        <div>
          {collection.images.length > 0 && (
            <>
              <img
                src={`${collection.images[selectedImage]}?auto=compress&cs=tinysrgb&w=600`}
                alt={collection.name}
                className="w-full rounded-xl mb-4 aspect-square object-cover"
              />
              {collection.images.length > 1 && (
                <div className="grid grid-cols-4 gap-2 mb-4">
                  {collection.images.map((img, idx) => (
                    <button
                      key={idx}
                      onClick={() => setSelectedImage(idx)}
                      className={`aspect-square rounded-lg overflow-hidden border-2 ${
                        idx === selectedImage ? "border-black" : "border-gray-200"
                      }`}
                    >
                      <img
                        src={`${img}?auto=compress&cs=tinysrgb&w=200`}
                        alt={`${collection.name} ${idx + 1}`}
                        className="w-full h-full object-cover"
                      />
                    </button>
                  ))}
                </div>
              )}
            </>
          )}
          <div className="rounded-xl border p-4">
            <p className="font-medium text-lg">{collection.name}</p>
            <p className="text-sm text-muted-foreground mt-2">
              {collection.images.length} image{collection.images.length === 1 ? "" : "s"}
            </p>
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
              <span>Collection</span>
              <span>{collection.name}</span>
            </div>
            <div className="flex items-center justify-between">
              <span>Images</span>
              <span>{collection.images.length}</span>
            </div>
            <div className="border-t pt-2 flex items-center justify-between font-medium text-lg">
              <span>Status</span>
              <span className="text-green-700">Ready to Order</span>
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
              onClick={() => navigate("/")}
              disabled={loading}
            >
              Back to Collections
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
