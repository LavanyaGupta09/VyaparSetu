import React, { useRef, useMemo, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Text, Line, Html } from '@react-three/drei';
import * as THREE from 'three';
import { useReducedMotion } from 'framer-motion';

const Node = ({ position, label, isSelected, onClick, color = '#3b82f6' }: any) => {
  const meshRef = useRef<THREE.Mesh>(null);
  const [hovered, setHover] = useState(false);

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.5 + position[0]) * 0.2;
      meshRef.current.position.y = position[1] + Math.sin(state.clock.elapsedTime * 1.5 + position[0]) * 0.1;
    }
  });

  return (
    <group position={position}>
      <mesh
        ref={meshRef}
        onClick={(e) => { e.stopPropagation(); onClick(); }}
        onPointerOver={() => setHover(true)}
        onPointerOut={() => setHover(false)}
      >
        <boxGeometry args={[1.5, 0.6, 0.2]} />
        <meshStandardMaterial 
          color={hovered || isSelected ? '#60a5fa' : color} 
          metalness={0.1}
          roughness={0.2}
          emissive={isSelected ? '#3b82f6' : '#000000'}
          emissiveIntensity={0.5}
        />
        <Text
          position={[0, 0, 0.11]}
          fontSize={0.15}
          color="#ffffff"
          anchorX="center"
          anchorY="middle"
          maxWidth={1.4}
        >
          {label}
        </Text>
      </mesh>
    </group>
  );
};

const Edge = ({ start, end }: { start: [number, number, number], end: [number, number, number] }) => {
  return (
    <Line
      points={[start, end]}
      color="#94a3b8"
      lineWidth={1.5}
      dashed={true}
      dashSize={0.1}
      dashScale={0.1}
    />
  );
};

interface DependencyGraph3DProps {
  nodes: any[];
  edges: any[];
  onNodeSelect: (id: string) => void;
  selectedId: string | null;
}

export const DependencyGraph3D: React.FC<DependencyGraph3DProps> = ({ nodes, edges, onNodeSelect, selectedId }) => {
  const shouldReduce = useReducedMotion();

  // Layout the nodes in a simple 3D grid/flow
  const nodePositions = useMemo(() => {
    const pos: Record<string, [number, number, number]> = {};
    const cols = 3;
    nodes.forEach((node, idx) => {
      const row = Math.floor(idx / cols);
      const col = idx % cols;
      pos[node.id] = [(col - 1) * 2.5, -row * 1.5 + 1.5, (row % 2) * 0.5]; // staggering Z depth
    });
    return pos;
  }, [nodes]);

  if (shouldReduce) {
    return (
      <div className="flex flex-col items-center justify-center p-8 bg-slate-50 border border-slate-200 rounded-xl text-slate-500">
        <p>Interactive 3D graph hidden (Reduced Motion is enabled).</p>
        <p className="text-sm mt-2">Please select approvals from the list view if available.</p>
      </div>
    );
  }

  return (
    <div className="w-full h-full min-h-[400px] cursor-grab active:cursor-grabbing bg-slate-900 rounded-2xl overflow-hidden relative">
      <Canvas camera={{ position: [0, 0, 6], fov: 50 }}>
        <ambientLight intensity={0.7} />
        <pointLight position={[10, 10, 10]} intensity={1} />
        <spotLight position={[-10, -10, 10]} intensity={0.5} color="#3b82f6" />
        
        <group position={[0, -0.5, 0]}>
          {edges.map((edge, idx) => {
            const start = nodePositions[edge.source];
            const end = nodePositions[edge.target];
            if (!start || !end) return null;
            return <Edge key={idx} start={start} end={end} />;
          })}

          {nodes.map((node) => (
            <Node 
              key={node.id}
              position={nodePositions[node.id]}
              label={node.name}
              isSelected={selectedId === node.id}
              onClick={() => onNodeSelect(node.id)}
              color={node.department === 'MIDC' ? '#10b981' : '#3b82f6'}
            />
          ))}
        </group>

        <OrbitControls 
          enableZoom={true} 
          minDistance={3} 
          maxDistance={10}
          enablePan={false}
          maxPolarAngle={Math.PI / 1.5}
          minPolarAngle={Math.PI / 4}
        />
      </Canvas>
      <div className="absolute bottom-4 right-4 text-xs text-white/50 bg-black/20 px-2 py-1 rounded backdrop-blur-sm pointer-events-none">
        Drag to rotate • Scroll to zoom
      </div>
    </div>
  );
};
