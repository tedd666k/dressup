export function buildWhatsAppOrder({ phone, message }: { phone?: string; message: string }) {
  const num = (phone || "").replace(/[^\d]/g, "");
  if (!num) return null;
  return `https://wa.me/${num}?text=${encodeURIComponent(message)}`;
}
