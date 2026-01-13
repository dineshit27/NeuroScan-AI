import { useRef, Suspense } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Sphere, MeshDistortMaterial, Float, OrbitControls } from '@react-three/drei';
import * as THREE from 'three';

function BrainMesh() {
  const meshRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.y = state.clock.elapsedTime * 0.2;
      meshRef.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.3) * 0.1;
    }
  });

  return (
    <Float speed={2} rotationIntensity={0.5} floatIntensity={1}>
      <group>
        {/* Main brain shape */}
        <Sphere ref={meshRef} args={[1.5, 64, 64]}>
          <MeshDistortMaterial
            color="#0ea5e9"
            attach="material"
            distort={0.4}
            speed={2}
            roughness={0.3}
            metalness={0.6}
            transparent
            opacity={0.9}
          />
        </Sphere>
        
        {/* Glowing inner core */}
        <Sphere args={[1.2, 32, 32]}>
          <meshBasicMaterial
            color="#2dd4bf"
            transparent
            opacity={0.3}
          />
        </Sphere>

        {/* Neural network particles */}
        {Array.from({ length: 30 }).map((_, i) => {
          const theta = (i / 30) * Math.PI * 2;
          const phi = Math.acos(2 * Math.random() - 1);
          const radius = 1.8 + Math.random() * 0.5;
          return (
            <mesh
              key={i}
              position={[
                radius * Math.sin(phi) * Math.cos(theta),
                radius * Math.sin(phi) * Math.sin(theta),
                radius * Math.cos(phi)
              ]}
            >
              <sphereGeometry args={[0.05, 8, 8]} />
              <meshBasicMaterial color="#0ea5e9" transparent opacity={0.8} />
            </mesh>
          );
        })}
      </group>
    </Float>
  );
}

function Scene() {
  return (
    <>
      <ambientLight intensity={0.5} />
      <pointLight position={[10, 10, 10]} intensity={1} color="#0ea5e9" />
      <pointLight position={[-10, -10, -10]} intensity={0.5} color="#2dd4bf" />
      <BrainMesh />
      <OrbitControls 
        enableZoom={false} 
        enablePan={false}
        autoRotate
        autoRotateSpeed={0.5}
      />
    </>
  );
}

export function Brain3D() {
  return (
    <div className="w-full h-[400px] md:h-[500px]">
      <Suspense fallback={
        <div className="w-full h-full flex items-center justify-center">
          <div className="w-32 h-32 rounded-full bg-primary/20 animate-pulse" />
        </div>
      }>
        <Canvas camera={{ position: [0, 0, 5], fov: 50 }}>
          <Scene />
        </Canvas>
      </Suspense>
    </div>
  );
}
