import React, { useRef, useState, useEffect, Suspense } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Float, Text, Center, Environment } from '@react-three/drei';

const Panel = ({ text, color, position, rotation }: { text: string, color: string, position: [number, number, number], rotation: [number, number, number] }) => {
  const mesh = useRef<any>(null);
  
  useFrame((state) => {
    if (mesh.current) {
      mesh.current.rotation.y = rotation[1] + Math.sin(state.clock.elapsedTime * 0.5) * 0.1;
      mesh.current.rotation.x = rotation[0] + Math.cos(state.clock.elapsedTime * 0.3) * 0.05;
    }
  });

  return (
    <Float speed={2} rotationIntensity={0.5} floatIntensity={1}>
      <mesh ref={mesh} position={position} rotation={rotation}>
        <boxGeometry args={[3, 2, 0.1]} />
        <meshPhysicalMaterial 
          color={color} 
          roughness={0.2}
          metalness={0.1}
          clearcoat={1}
          transparent
          opacity={0.9}
        />
        <Center position={[0, 0, 0.06]}>
          <Text
            color="#ffffff"
            fontSize={0.4}
            maxWidth={2.5}
            lineHeight={1}
            letterSpacing={0.02}
            textAlign="center"
            anchorX="center"
            anchorY="middle"
          >
            {text}
          </Text>
        </Center>
      </mesh>
    </Float>
  );
};

export default function Hero3D() {
  const [reduceMotion, setReduceMotion] = useState(false);
  const [mouse, setMouse] = useState({ x: 0, y: 0 });
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setReduceMotion(mediaQuery.matches);
    const handleChange = (e: MediaQueryListEvent) => setReduceMotion(e.matches);
    mediaQuery.addEventListener('change', handleChange);
    
    setIsMobile(window.innerWidth < 768);
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener('resize', handleResize);

    const handleMouseMove = (e: MouseEvent) => {
      setMouse({
        x: (e.clientX / window.innerWidth) * 2 - 1,
        y: -(e.clientY / window.innerHeight) * 2 + 1,
      });
    };
    window.addEventListener('mousemove', handleMouseMove);
    
    return () => {
      mediaQuery.removeEventListener('change', handleChange);
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

  if (reduceMotion || isMobile) {
    return (
      <div className="w-full h-[400px] flex items-center justify-center">
         {/* Fallback geometric illustration for mobile / reduced motion */}
         <div className="relative w-full h-full max-w-lg mx-auto opacity-80">
            <div className="absolute top-10 left-10 w-32 h-20 bg-blue-500 rounded-lg shadow-lg rotate-[-5deg]"></div>
            <div className="absolute top-20 right-10 w-32 h-20 bg-emerald-500 rounded-lg shadow-lg rotate-[5deg]"></div>
            <div className="absolute bottom-20 left-20 w-32 h-20 bg-purple-500 rounded-lg shadow-lg rotate-[3deg]"></div>
            <div className="absolute bottom-10 right-20 w-32 h-20 bg-amber-500 rounded-lg shadow-lg rotate-[-3deg]"></div>
         </div>
      </div>
    );
  }

  return (
    <div className="w-full h-[400px] md:h-[500px]">
      <Canvas camera={{ position: [0, 0, 8], fov: 45 }}>
        <ambientLight intensity={0.5} />
        <directionalLight position={[10, 10, 5]} intensity={1} />
        <Environment preset="city" />
        <Suspense fallback={null}>
          <group rotation={[mouse.y * 0.1, mouse.x * 0.1, 0]}>
            <Panel text="Approvals" color="#3b82f6" position={[-2.5, 1, 0]} rotation={[0.1, 0.2, 0]} />
            <Panel text="Documents" color="#10b981" position={[2.5, 1.5, -1]} rotation={[-0.1, -0.2, 0.1]} />
            <Panel text="Schemes" color="#8b5cf6" position={[-2, -1.5, 1]} rotation={[-0.2, 0.1, -0.1]} />
            <Panel text="Compliance" color="#f59e0b" position={[2, -1, 0]} rotation={[0.1, -0.1, 0]} />
          </group>
        </Suspense>
      </Canvas>
    </div>
  );
}
