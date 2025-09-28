import Header from "./Header";
import Footer from "./Footer";

import Background from "@/components/design/Background";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative min-h-screen flex flex-col bg-background text-foreground">
      <Background />
      <Header />
      <main className="flex-1 relative z-10">{children}</main>
      <Footer />
      <WhatsAppPopup />
    </div>
  );
}
