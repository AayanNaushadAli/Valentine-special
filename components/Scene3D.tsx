
import React, { useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Float, OrbitControls, MeshDistortMaterial, Sparkles } from '@react-three/drei';
import * as THREE from 'three';

const HeartShape = () => {
  const meshRef = useRef<THREE.Mesh>(null!);
  
  // Heart shape definition
  const shape = new THREE.Shape();
  shape.moveTo(0, 0.5);
  shape.bezierCurveTo(0, 0.5, -0.5, 1, -1, 1);
  shape.bezierCurveTo(-1.5, 1, -1.5, 0.5, -1.5, 0.5);
  shape.bezierCurveTo(-1.5, 0, -1, -0.5, 0, -1.5);
  shape.bezierCurveTo(1, -0.5, 1.5, 0, 1.5, 0.5);
  shape.bezierCurveTo(1.5, 0.5, 1.5, 1, 1, 1);
  shape.bezierCurveTo(0.5, 1, 0, 0.5, 0, 0.5);

  const extrudeSettings = {
    depth: 0.4,
    bevelEnabled: true,
    bevelSegments: 10,
    steps: 2,
    bevelSize: 0.2,
    bevelThickness: 0.2,
  };

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.y = state.clock.getElapsedTime() * 0.5;
    }
  });

  return (
    <Float speed={2} rotationIntensity={1.5} floatIntensity={2}>
      <mesh ref={meshRef} scale={[0.8, 0.8, 0.8]}>
        <extrudeGeometry args={[shape, extrudeSettings]} />
        <MeshDistortMaterial
          color="#ff4d6d"
          speed={2}
          distort={0.2}
          roughness={0.2}
          metalness={0.8}
          emissive="#ff1a1a"
          emissiveIntensity={0.2}
        />
      </mesh>
    </Float>
  );
};

const Scene3D: React.FC = () => {
  return (
    <div className="w-full h-full">
      <Canvas camera={{ position: [0, 0, 5], fov: 45 }}>
        <ambientLight intensity={1.5} />
        <pointLight position={[10, 10, 10]} intensity={1} />
        <spotLight position={[-10, 10, 10]} angle={0.15} penumbra={1} intensity={1} />
        <HeartShape />
        <Sparkles count={50} scale={5} size={2} speed={0.4} color="#ffb3c1" />
        <OrbitControls enableZoom={false} autoRotate autoRotateSpeed={0.5} />
      </Canvas>
    </div>
  );
};

export default Scene3D;
