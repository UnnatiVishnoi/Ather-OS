import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Float, Cloud, Clouds, Stars, Environment } from "@react-three/drei";
import { Suspense, useMemo, useRef } from "react";
import * as THREE from "three";

function FloatingPlatform({ position, scale = 1, color = "#00D9FF" }: { position: [number, number, number]; scale?: number; color?: string }) {
  const ref = useRef<THREE.Group>(null!);
  useFrame((state) => {
    if (!ref.current) return;
    ref.current.position.y = position[1] + Math.sin(state.clock.elapsedTime * 0.4 + position[0]) * 0.15;
    ref.current.rotation.y += 0.0008;
  });
  return (
    <group ref={ref} position={position} scale={scale}>
      {/* base disc */}
      <mesh castShadow receiveShadow position={[0, 0, 0]}>
        <cylinderGeometry args={[1.6, 1.8, 0.18, 8]} />
        <meshStandardMaterial color="#0B1020" metalness={0.9} roughness={0.25} />
      </mesh>
      {/* glowing rim */}
      <mesh position={[0, 0.1, 0]}>
        <torusGeometry args={[1.62, 0.018, 8, 64]} />
        <meshBasicMaterial color={color} toneMapped={false} />
      </mesh>
      {/* tower */}
      <mesh position={[0, 0.7, 0]}>
        <boxGeometry args={[0.5, 1.2, 0.5]} />
        <meshStandardMaterial color="#111827" metalness={0.85} roughness={0.3} emissive={color} emissiveIntensity={0.08} />
      </mesh>
      {/* spire */}
      <mesh position={[0, 1.6, 0]}>
        <coneGeometry args={[0.12, 0.6, 6]} />
        <meshStandardMaterial color={color} emissive={color} emissiveIntensity={0.8} toneMapped={false} />
      </mesh>
      {/* light strip */}
      <mesh position={[0, 0.7, 0.26]}>
        <planeGeometry args={[0.06, 0.9]} />
        <meshBasicMaterial color={color} toneMapped={false} />
      </mesh>
    </group>
  );
}

function Particles({ count = 200 }: { count?: number }) {
  const ref = useRef<THREE.Points>(null!);
  const positions = useMemo(() => {
    const arr = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      arr[i * 3] = (Math.random() - 0.5) * 40;
      arr[i * 3 + 1] = (Math.random() - 0.5) * 20;
      arr[i * 3 + 2] = (Math.random() - 0.5) * 30 - 5;
    }
    return arr;
  }, [count]);
  useFrame((state) => {
    if (ref.current) ref.current.rotation.y = state.clock.elapsedTime * 0.02;
  });
  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <pointsMaterial size={0.05} color="#4CC9FF" transparent opacity={0.7} sizeAttenuation depthWrite={false} />
    </points>
  );
}

function ParallaxRig() {
  const { camera, mouse } = useThree();
  useFrame(() => {
    camera.position.x += (mouse.x * 1.2 - camera.position.x) * 0.03;
    camera.position.y += (-mouse.y * 0.6 + 1.5 - camera.position.y) * 0.03;
    camera.lookAt(0, 0.5, 0);
  });
  return null;
}

function CloudLayer() {
  return (
    <Clouds material={THREE.MeshBasicMaterial}>
      <Cloud seed={1} segments={30} bounds={[14, 2, 6]} volume={8} color="#1a2540" position={[0, -3, -4]} fade={40} />
      <Cloud seed={4} segments={20} bounds={[12, 2, 5]} volume={6} color="#0f1830" position={[6, -2, -8]} fade={30} />
      <Cloud seed={7} segments={20} bounds={[12, 2, 5]} volume={6} color="#0c1428" position={[-7, -2.5, -6]} fade={30} />
    </Clouds>
  );
}

export default function Scene3D({ intensity = 1 }: { intensity?: number }) {
  return (
    <div className="fixed inset-0 -z-10 pointer-events-none">
      <Canvas
        camera={{ position: [0, 1.5, 8], fov: 55 }}
        gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
        dpr={[1, 1.6]}
      >
        <color attach="background" args={["#06070A"]} />
        <fog attach="fog" args={["#06070A", 12, 38]} />

        <ambientLight intensity={0.25 * intensity} />
        <directionalLight position={[5, 8, 5]} intensity={0.6 * intensity} color="#4CC9FF" />
        <pointLight position={[-6, 2, 4]} intensity={1.2 * intensity} color="#8B5CF6" distance={20} />
        <pointLight position={[6, 3, 2]} intensity={1.0 * intensity} color="#00D9FF" distance={20} />

        <Suspense fallback={null}>
          <Stars radius={60} depth={40} count={1500} factor={3} fade speed={0.4} />
          <CloudLayer />

          <Float speed={1.2} rotationIntensity={0.15} floatIntensity={0.6}>
            <FloatingPlatform position={[-3.2, 0.2, -2]} scale={1.1} color="#00D9FF" />
          </Float>
          <Float speed={1} rotationIntensity={0.1} floatIntensity={0.5}>
            <FloatingPlatform position={[3.4, -0.5, -3]} scale={1.3} color="#8B5CF6" />
          </Float>
          <Float speed={0.9} rotationIntensity={0.08} floatIntensity={0.4}>
            <FloatingPlatform position={[0, 1.2, -6]} scale={0.9} color="#4CC9FF" />
          </Float>
          <Float speed={1.1} rotationIntensity={0.1} floatIntensity={0.5}>
            <FloatingPlatform position={[-6, -1, -7]} scale={0.7} color="#4CC9FF" />
          </Float>

          {/* holographic bridge */}
          <mesh position={[0, -0.8, -3]} rotation={[-Math.PI / 2, 0, 0]}>
            <planeGeometry args={[8, 0.4]} />
            <meshBasicMaterial color="#00D9FF" transparent opacity={0.12} toneMapped={false} />
          </mesh>

          <Particles count={250} />
          <Environment preset="night" />
        </Suspense>

        <ParallaxRig />
      </Canvas>
    </div>
  );
}
