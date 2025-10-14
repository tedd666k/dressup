import { useEffect, useState } from "react";
import { storage } from "@/lib/storage";

export type PagesContent = {
  about: { title: string; body: string };
};

const KEY = "meya.content";
const DEFAULTS: PagesContent = {
  about: {
    title: "About Meya Karis",
    body: "Meya Karis is a contemporary fashion house crafting minimalist silhouettes with meticulous tailoring. Each piece is designed for movement, form, and timeless elegance.",
  },
};

export function useContent() {
  const [content, setContent] = useState<PagesContent>(() =>
    storage.get(KEY, DEFAULTS),
  );
  useEffect(() => storage.set(KEY, content), [content]);
  return { content, setContent };
}
