import React, { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Float, Environment, ContactShadows, MeshDistortMaterial } from '@react-three/drei';
import * as THREE from 'three';
import { useReducedMotion } from 'framer-motion';

const Orb = ({ position, color, speed, distort, scale = 1 }: any) => {
  const meshRef = useRef<THREE.Mesh>(null);
  
  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.x = state.clock.elapsedTime * speed;
      meshRef.current.rotation.y = state.clock.elapsedTime * speed * 1.5;
    }
  });

  return (
    <Float speed={speed * 2} rotationIntensity={1} floatIntensity={2} position={position}>
      <mesh ref={meshRef} scale={scale}>
        <sphereGeometry args={[1, 64, 64]} />
        <MeshDistortMaterial 
          color={color} 
          envMapIntensity={1} 
          clearcoat={0.8} 
          clearcoatRoughness={0} 
          metalness={0.2} 
          roughness={0.1}
          distort={distort} 
          speed={speed * 4}
        />
      </mesh>
    </Float>
  );
};

interface CommandCenterOrbsProps {
  healthScore?: number; // 0 to 100
  className?: string;
}

export const CommandCenterOrbs: React.FC<CommandCenterOrbsProps> = ({ healthScore = 85, className = '' }) => {
  const shouldReduce = useReducedMotion();

  // Fallback for reduced motion or no WebGL
  if (shouldReduce) {
    return (
      <div className={`flex items-center justify-center bg-slate-50 rounded-full ${className}`}>
        <div className="w-16 h-16 rounded-full bg-gradient-to-br from-blue-400 to-indigo-600 shadow-inner flex items-center justify-center text-white font-bold text-xl">
          {healthScore}%
        </div>
      </div>
    );
  }

  // Determine colors based on health
  const isHealthy = healthScore >= 75;
  const isWarning = healthScore >= 50 && healthScore < 75;
  
  const mainColor = isHealthy ? '#3b82f6' : isWarning ? '#f59e0b' : '#ef4444';
  const secondaryColor = isHealthy ? '#6366f1' : isWarning ? '#fbbf24' : '#f87171';

  return (
    <div className={`relative ${className}`} aria-hidden="true">
      <Canvas camera={{ position: [0, 0, 5], fov: 45 }} dpr={[1, 2]}>
        <ambientLight intensity={0.5} />
        <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} intensity={1} castShadow />
        
        <Orb position={[-0.5, 0, 0]} color={mainColor} speed={0.5} distort={0.3} scale={1.2} />
        <Orb position={[0.8, -0.2, 0.5]} color={secondaryColor} speed={0.8} distort={0.4} scale={0.6} />
        <Orb position={[0.2, 0.8, -0.5]} color="#93c5fd" speed={0.4} distort={0.2} scale={0.4} />

        <Environment preset="city" />
        <ContactShadows position={[0, -1.5, 0]} opacity={0.4} scale={10} blur={2} far={4} />
      </Canvas>
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none drop-shadow-md">
        <span className="text-3xl font-extrabold text-white" style={{ textShadow: '0 2px 10px rgba(0,0,0,0.3)' }}>
          {healthScore}%
        </span>
      </div>
    </div>
  );
};
