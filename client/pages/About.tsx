import { useContent } from "@/hooks/useContent";

export default function About() {
  const { content } = useContent();
  return (
    <div className="container mx-auto py-10 max-w-3xl">
      <h1 className="text-3xl md:text-4xl font-serif">{content.about.title}</h1>
      <p className="mt-4 text-muted-foreground leading-relaxed whitespace-pre-line">{content.about.body}</p>
    </div>
  );
}
