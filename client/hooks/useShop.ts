import { useEffect, useMemo, useState } from "react";
import { storage } from "@/lib/storage";
import { DEFAULT_PRODUCTS, type Product } from "@/lib/products";

export type CartLine = { id: string; qty: number };
export type Collection = { id: string; name: string; images: string[]; featured?: boolean };
export type ShopState = { products: Product[]; cart: CartLine[]; collections: Collection[] };
const KEY = "meya.shop";

function normalize(state: ShopState): ShopState {
  return {
    products: state.products,
    cart: state.cart.filter((l) => l.qty > 0),
    collections: state.collections || [],
  };
}

export function useShop() {
  const [state, setState] = useState<ShopState>(() => {
    const s = storage.get(KEY, { products: DEFAULT_PRODUCTS, cart: [], collections: [] } as ShopState);
    return { products: s.products ?? DEFAULT_PRODUCTS, cart: s.cart ?? [], collections: s.collections ?? [] };
  });

  useEffect(() => storage.set(KEY, normalize(state)), [state]);

  const productsMap = useMemo(() => new Map(state.products.map((p) => [p.id, p])), [state.products]);

  const addToCart = (id: string, qty = 1) => {
    setState((s) => {
      const product = s.products.find((p) => p.id === id);
      if (!product || product.stock < qty) return s;
      const cart = [...s.cart];
      const idx = cart.findIndex((l) => l.id === id);
      if (idx >= 0) cart[idx] = { id, qty: cart[idx].qty + qty };
      else cart.push({ id, qty });
      const products = s.products.map((p) => (p.id === id ? { ...p, stock: p.stock - qty } : p));
      return { products, cart };
    });
  };

  const removeFromCart = (id: string) => setState((s) => ({ ...s, cart: s.cart.filter((l) => l.id !== id) }));
  const setStock = (id: string, stock: number) => setState((s) => ({ ...s, products: s.products.map((p) => (p.id === id ? { ...p, stock } : p)) }));
  const setPrice = (id: string, price: number) => setState((s) => ({ ...s, products: s.products.map((p) => (p.id === id ? { ...p, price } : p)) }));
  const addProduct = (p: Product) => setState((s) => ({ ...s, products: [...s.products, p] }));

  const clearCart = () => setState((s) => ({ ...s, cart: [] }));

  const addCollection = (name: string) => setState((s) => ({ ...s, collections: [...s.collections, { id: `c_${Date.now()}`, name, images: [] }] }));
  const removeCollection = (id: string) => setState((s) => ({ ...s, collections: s.collections.filter((c) => c.id !== id) }));
  const renameCollection = (id: string, name: string) => setState((s)=>({ ...s, collections: s.collections.map(c=>c.id===id?{...c, name}:c) }));
  const addCollectionImage = (id: string, url: string) => setState((s)=>({ ...s, collections: s.collections.map(c=>c.id===id?{...c, images:[...c.images, url]}:c) }));
  const removeCollectionImage = (id: string, url: string) => setState((s)=>({ ...s, collections: s.collections.map(c=>c.id===id?{...c, images:c.images.filter(u=>u!==url)}:c) }));

  return { state, productsMap, addToCart, removeFromCart, setStock, setPrice, addProduct, clearCart, addCollection, removeCollection, renameCollection, addCollectionImage, removeCollectionImage };
}

export function useUser() {
  type UserState = { registered: boolean; discountAvailable: boolean };
  const KEY_U = "meya.user";
  const [user, setUser] = useState<UserState>(() => storage.get(KEY_U, { registered: false, discountAvailable: false }));
  useEffect(() => storage.set(KEY_U, user), [user]);
  const register = () => setUser({ registered: true, discountAvailable: true });
  const consumeDiscount = () => setUser((u) => ({ ...u, discountAvailable: false }));
  return { user, register, consumeDiscount };
}

export function useSettings() {
  type Settings = { ownerPhone?: string; momoProvider?: "paystack" | "flutterwave" | "manual"; paystackKey?: string };
  const KEY_S = "meya.settings";
  const [settings, setSettings] = useState<Settings>(() => storage.get(KEY_S, { momoProvider: "manual" }));
  useEffect(() => storage.set(KEY_S, settings), [settings]);
  return { settings, setSettings };
}
