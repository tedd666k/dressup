export type Product = { id: string; name: string; price: number; stock: number; image: string; category: "dresses" | "skirts"; sizes: string[] };

export const DEFAULT_PRODUCTS: Product[] = [
  { id: "mk-aline", name: "A‑Line Classic", price: 850, stock: 6, image: "https://images.pexels.com/photos/25650913/pexels-photo-25650913.jpeg", category: "dresses", sizes: ["XS", "S", "M", "L", "XL"] },
  { id: "mk-mermaid", name: "Mermaid Noir", price: 990, stock: 3, image: "https://images.pexels.com/photos/32486448/pexels-photo-32486448.jpeg", category: "dresses", sizes: ["XS", "S", "M", "L", "XL", "XXL"] },
  { id: "mk-coat", name: "Trench Sculpt", price: 720, stock: 8, image: "https://images.pexels.com/photos/28283487/pexels-photo-28283487.jpeg", category: "skirts", sizes: ["S", "M", "L", "XL"] },
  { id: "mk-gown", name: "Evening Gown", price: 1250, stock: 2, image: "https://images.pexels.com/photos/32100313/pexels-photo-32100313.jpeg", category: "dresses", sizes: ["S", "M", "L"] },
];
