import { useContent } from "@/hooks/useContent";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";

export default function PagesEditor() {
  const { content, setContent } = useContent();
  const [title, setTitle] = useState(content.about.title);
  const [body, setBody] = useState(content.about.body);
  const [saved, setSaved] = useState(false);

  useEffect(()=>{ setTitle(content.about.title); setBody(content.about.body); }, [content.about.title, content.about.body]);

  const save = () => {
    setContent({ ...content, about: { title, body } });
    setSaved(true);
    setTimeout(()=>setSaved(false), 1500);
  };

  return (
    <div className="grid gap-3">
      <div>
        <label className="text-sm">About Title</label>
        <Input value={title} onChange={(e)=>setTitle(e.target.value)} />
      </div>
      <div>
        <label className="text-sm">About Body</label>
        <textarea className="w-full rounded-md border bg-background p-3 min-h-[160px]" value={body} onChange={(e)=>setBody(e.target.value)} />
      </div>
      <div>
        <Button onClick={save}>Save Pages</Button>
        {saved && <span className="ml-2 text-xs text-green-700">Saved</span>}
      </div>
    </div>
  );
}
