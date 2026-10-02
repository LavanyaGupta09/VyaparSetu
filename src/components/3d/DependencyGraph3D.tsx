import React, { useRef, useMemo, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Line, Html } from '@react-three/drei';
import * as THREE from 'three';
import { useReducedMotion } from 'framer-motion';

class ErrorBoundary extends React.Component<{ fallback: React.ReactNode; children: React.ReactNode }, { hasError: boolean }> {
  constructor(props: any) {
    super(props);
    this.state = { hasError: false };
  }
  static getDerivedStateFromError() {
    return { hasError: true };
  }
  componentDidCatch(error: any, info: any) {
    console.error("3D Graph Error:", error, info);
  }
  render() {
    if (this.state.hasError) {
      return this.props.fallback;
    }
    return this.props.children;
  }
}

const Node = ({ position, label, isSelected, onClick, color = '#3b82f6' }: any) => {
  const meshRef = useRef<THREE.Mesh>(null);
  const [hovered, setHover] = useState(false);

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.5 + position[0]) * 0.2;
      meshRef.current.position.y = Math.sin(state.clock.elapsedTime * 1.5 + position[0]) * 0.1;
    }
  });

  return (
    <group position={position}>
      <mesh
        ref={meshRef}
        onClick={(e) => { e.stopPropagation(); onClick(); }}
        onPointerOver={(e) => { e.stopPropagation(); setHover(true); document.body.style.cursor = 'pointer'; }}
        onPointerOut={(e) => { e.stopPropagation(); setHover(false); document.body.style.cursor = 'auto'; }}
      >
        <boxGeometry args={[2.5, 0.8, 0.2]} />
        <meshStandardMaterial 
          color={hovered || isSelected ? '#60a5fa' : color} 
          metalness={0.1}
          roughness={0.2}
          emissive={isSelected ? '#3b82f6' : '#000000'}
          emissiveIntensity={0.5}
        />
        <Html transform center position={[0, 0, 0.11]} style={{ pointerEvents: 'none' }} distanceFactor={8}>
          <div className="w-48 flex flex-col items-center justify-center text-center">
            <span className="text-white font-semibold text-base leading-tight drop-shadow-md">
              {label}
            </span>
          </div>
        </Html>
      </mesh>
    </group>
  );
};

const Edge = ({ start, end }: { start: [number, number, number], end: [number, number, number] }) => {
  return (
    <Line
      points={[start, end]}
      color="#94a3b8"
      lineWidth={2}
      dashed={false}
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

  const nodePositions = useMemo(() => {
    const pos: Record<string, [number, number, number]> = {};
    const cols = 3;
    nodes.forEach((node, idx) => {
      const row = Math.floor(idx / cols);
      const col = idx % cols;
      pos[node.id] = [(col - 1) * 3.5, -row * 2.0 + 1.5, (row % 2) * 0.5]; 
    });
    return pos;
  }, [nodes]);

  const fallback2D = (
    <div className="p-4 bg-slate-50 flex flex-wrap gap-4 items-center justify-center min-h-[400px]">
      {nodes.length > 0 ? nodes.map(node => (
        <button 
          key={node.id} 
          onClick={() => onNodeSelect(node.id)}
          className={`p-4 border rounded-xl shadow-sm text-sm font-semibold transition-all ${
            selectedId === node.id ? 'bg-blue-50 border-blue-500 text-blue-700' : 'bg-white border-slate-200 hover:border-blue-300'
          }`}
        >
          {node.name}
        </button>
      )) : (
        <p className="text-slate-500">No dependencies to show.</p>
      )}
    </div>
  );

  if (shouldReduce) {
    return fallback2D;
  }

  return (
    <div className="w-full h-full min-h-[500px] cursor-grab active:cursor-grabbing bg-slate-900 rounded-2xl overflow-hidden relative">
      <ErrorBoundary fallback={fallback2D}>
        <Canvas camera={{ position: [0, 0, 10], fov: 45 }}>
          <ambientLight intensity={1.5} />
          <directionalLight position={[10, 20, 10]} intensity={2} />
          <pointLight position={[-10, -10, -10]} intensity={0.5} />
          
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
            minDistance={4} 
            maxDistance={20}
            enablePan={false}
            maxPolarAngle={Math.PI / 1.5}
            minPolarAngle={Math.PI / 6}
          />
        </Canvas>
      </ErrorBoundary>
      <div className="absolute bottom-4 right-4 text-xs text-white/50 bg-black/20 px-2 py-1 rounded backdrop-blur-sm pointer-events-none">
        Drag to rotate • Scroll to zoom
      </div>
    </div>
  );
};
