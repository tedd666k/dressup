import { Canvas } from "@react-three/fiber";
import { OrbitControls, Stage } from "@react-three/drei";
import Garment from "./Garment";

export default function ModelViewer({
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
    <div className="w-full h-[65vh] sm:h-[70vh] rounded-md overflow-hidden">
      <Canvas shadows camera={{ position: [0, 0.9, 2.8], fov: 35 }} style={{ background: bgColor }}>
        <ambientLight intensity={0.6} />
        <directionalLight position={[4, 6, 3]} intensity={1.2} castShadow />
        <Stage intensity={0.4} environment={undefined} adjustCamera={false}>
          <Garment color={color} accent={accent} variant={variant} />
        </Stage>
        <OrbitControls enablePan={false} enableDamping dampingFactor={0.1} />
      </Canvas>
    </div>
  );
}
