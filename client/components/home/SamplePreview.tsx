import { Canvas } from "@react-three/fiber";
import Garment from "@/components/3d/Garment";

export default function SamplePreview({
  color,
  accent,
  variant,
  bg = "light",
}: {
  color: string;
  accent?: string;
  variant: "aline" | "mermaid" | "coat" | "gown";
  bg?: "light" | "dark";
}) {
  const bgColor = bg === "dark" ? "#0b0b0c" : "#ffffff";
  return (
    <div className="w-full aspect-square rounded-lg overflow-hidden border">
      <Canvas camera={{ position: [0, 0.9, 2.6], fov: 35 }} style={{ background: bgColor }}>
        <ambientLight intensity={0.5} />
        <directionalLight position={[4, 6, 3]} intensity={0.9} />
        <Garment color={color} accent={accent} variant={variant} rotate />
      </Canvas>
    </div>
  );
}
