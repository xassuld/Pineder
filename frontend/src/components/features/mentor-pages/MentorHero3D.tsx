import React, { useRef, useMemo, useEffect } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import {
  OrbitControls,
  Float,
  Text3D,
  Center,
  useTexture,
  Environment,
} from "@react-three/drei";
import * as THREE from "three";
import { useTheme } from "../../../core/contexts/ThemeContext";

// Floating Book Component
const FloatingBook = ({
  position,
  rotation,
  scale,
}: {
  position: [number, number, number];
  rotation: [number, number, number];
  scale: number;
}) => {
  const meshRef = useRef<THREE.Mesh>(null);
  const { colors } = useTheme();

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.position.y =
        position[1] + Math.sin(state.clock.elapsedTime * 0.5) * 0.1;
      meshRef.current.rotation.y = rotation[1] + state.clock.elapsedTime * 0.2;
    }
  });

  return (
    <Float speed={1.5} rotationIntensity={0.5} floatIntensity={0.5}>
      <mesh ref={meshRef} position={position} rotation={rotation} scale={scale}>
        <boxGeometry args={[1, 1.4, 0.1]} />
        <meshStandardMaterial
          color={colors?.accent?.primary || "#08CB00"}
          metalness={0.1}
          roughness={0.8}
        />
      </mesh>
    </Float>
  );
};

// Floating Light Bulb Component
const FloatingLightBulb = ({
  position,
  rotation,
  scale,
}: {
  position: [number, number, number];
  rotation: [number, number, number];
  scale: number;
}) => {
  const meshRef = useRef<THREE.Group>(null);
  const { colors } = useTheme();

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.position.y =
        position[1] + Math.sin(state.clock.elapsedTime * 0.8) * 0.15;
      meshRef.current.rotation.z =
        rotation[2] + Math.sin(state.clock.elapsedTime * 0.3) * 0.1;
    }
  });

  return (
    <Float speed={2} rotationIntensity={0.3} floatIntensity={0.8}>
      <group
        ref={meshRef}
        position={position}
        rotation={rotation}
        scale={scale}
      >
        {/* Bulb */}
        <mesh>
          <sphereGeometry args={[0.3, 16, 16]} />
          <meshStandardMaterial
            color={colors?.accent?.secondary || "#FFD700"}
            emissive={colors?.accent?.secondary || "#FFD700"}
            emissiveIntensity={0.3}
            metalness={0.9}
            roughness={0.1}
          />
        </mesh>
        {/* Base */}
        <mesh position={[0, -0.4, 0]}>
          <cylinderGeometry args={[0.1, 0.1, 0.2, 8]} />
          <meshStandardMaterial
            color={colors?.accent?.info || "#666"}
            metalness={0.8}
            roughness={0.2}
          />
        </mesh>
      </group>
    </Float>
  );
};

// Floating Code Symbol Component
const FloatingCodeSymbol = ({
  position,
  rotation,
  scale,
}: {
  position: [number, number, number];
  rotation: [number, number, number];
  scale: number;
}) => {
  const meshRef = useRef<THREE.Group>(null);
  const { colors } = useTheme();

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.position.y =
        position[1] + Math.sin(state.clock.elapsedTime * 0.6) * 0.12;
      meshRef.current.rotation.y = rotation[1] + state.clock.elapsedTime * 0.4;
    }
  });

  return (
    <Float speed={1.8} rotationIntensity={0.4} floatIntensity={0.6}>
      <group
        ref={meshRef}
        position={position}
        rotation={rotation}
        scale={scale}
      >
        {/* Code brackets */}
        <mesh position={[-0.2, 0, 0]}>
          <boxGeometry args={[0.1, 0.6, 0.1]} />
          <meshStandardMaterial
            color={colors?.accent?.primary || "#08CB00"}
            metalness={0.2}
            roughness={0.7}
          />
        </mesh>
        <mesh position={[0.2, 0, 0]}>
          <boxGeometry args={[0.1, 0.6, 0.1]} />
          <meshStandardMaterial
            color={colors?.accent?.primary || "#08CB00"}
            metalness={0.2}
            roughness={0.7}
          />
        </mesh>
        {/* Code lines */}
        <mesh position={[0, 0.15, 0]}>
          <boxGeometry args={[0.3, 0.05, 0.05]} />
          <meshStandardMaterial
            color={colors?.text?.primary || "#333"}
            metalness={0.1}
            roughness={0.8}
          />
        </mesh>
        <mesh position={[0, 0, 0]}>
          <boxGeometry args={[0.2, 0.05, 0.05]} />
          <meshStandardMaterial
            color={colors?.text?.primary || "#333"}
            metalness={0.1}
            roughness={0.8}
          />
        </mesh>
        <mesh position={[0, -0.15, 0]}>
          <boxGeometry args={[0.25, 0.05, 0.05]} />
          <meshStandardMaterial
            color={colors?.text?.primary || "#333"}
            metalness={0.1}
            roughness={0.8}
          />
        </mesh>
      </group>
    </Float>
  );
};

// Floating Mentor Icon Component
const FloatingMentorIcon = ({
  position,
  rotation,
  scale,
}: {
  position: [number, number, number];
  rotation: [number, number, number];
  scale: number;
}) => {
  const meshRef = useRef<THREE.Group>(null);
  const { colors } = useTheme();

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.position.y =
        position[1] + Math.sin(state.clock.elapsedTime * 0.7) * 0.13;
      meshRef.current.rotation.y = rotation[1] + state.clock.elapsedTime * 0.25;
    }
  });

  return (
    <Float speed={1.6} rotationIntensity={0.6} floatIntensity={0.7}>
      <group
        ref={meshRef}
        position={position}
        rotation={rotation}
        scale={scale}
      >
        {/* Head */}
        <mesh position={[0, 0.3, 0]}>
          <sphereGeometry args={[0.2, 16, 16]} />
          <meshStandardMaterial
            color={colors?.accent?.secondary || "#FFD700"}
            metalness={0.1}
            roughness={0.8}
          />
        </mesh>
        {/* Body */}
        <mesh position={[0, -0.1, 0]}>
          <cylinderGeometry args={[0.15, 0.15, 0.4, 8]} />
          <meshStandardMaterial
            color={colors?.accent?.primary || "#08CB00"}
            metalness={0.2}
            roughness={0.7}
          />
        </mesh>
        {/* Arms */}
        <mesh position={[-0.25, 0, 0]}>
          <boxGeometry args={[0.1, 0.3, 0.1]} />
          <meshStandardMaterial
            color={colors?.accent?.primary || "#08CB00"}
            metalness={0.2}
            roughness={0.7}
          />
        </mesh>
        <mesh position={[0.25, 0, 0]}>
          <boxGeometry args={[0.1, 0.3, 0.1]} />
          <meshStandardMaterial
            color={colors?.accent?.primary || "#08CB00"}
            metalness={0.2}
            roughness={0.7}
          />
        </mesh>
      </group>
    </Float>
  );
};

// Particle System
const ParticleSystem = ({ count = 100 }: { count?: number }) => {
  const { colors } = useTheme();
  const meshRef = useRef<THREE.InstancedMesh>(null);

  const particles = useMemo(() => {
    const temp = [];
    for (let i = 0; i < count; i++) {
      const time = Math.random() * 100;
      const factor = Math.random() * 20 + 10;
      const speed = Math.random() * 0.01 + 0.003;
      const scale = Math.random() * 0.1 + 0.05;
      temp.push({ time, factor, speed, scale });
    }
    return temp;
  }, [count]);

  useFrame((state) => {
    if (meshRef.current) {
      particles.forEach((particle, i) => {
        const { time, factor, speed, scale } = particle;
        const t = (state.clock.elapsedTime + time) * speed;

        const mesh = meshRef.current!;
        mesh.setMatrixAt(
          i,
          new THREE.Matrix4()
            .setPosition(
              Math.sin(t) * factor,
              Math.cos(t) * factor,
              Math.sin(t) * Math.cos(t) * factor
            )
            .scale(new THREE.Vector3(scale, scale, scale))
        );
      });
      meshRef.current.instanceMatrix.needsUpdate = true;
    }
  });

  return (
    <instancedMesh ref={meshRef} args={[undefined, undefined, count]}>
      <sphereGeometry args={[0.02, 8, 8]} />
      <meshStandardMaterial
        color={colors?.accent?.primary || "#08CB00"}
        transparent
        opacity={0.6}
        emissive={colors?.accent?.primary || "#08CB00"}
        emissiveIntensity={0.2}
      />
    </instancedMesh>
  );
};

// Main Scene Component
const MentorScene = () => {
  const { colors } = useTheme();

  return (
    <>
      {/* Lighting */}
      <ambientLight intensity={0.4} />
      <directionalLight
        position={[10, 10, 5]}
        intensity={1}
        castShadow
        shadow-mapSize-width={2048}
        shadow-mapSize-height={2048}
      />
      <pointLight
        position={[-10, -10, -5]}
        intensity={0.5}
        color={colors?.accent?.secondary || "#FFD700"}
      />

      {/* Environment */}
      <Environment preset="city" />

      {/* 3D Objects */}
      <FloatingBook position={[-2, 1, 0]} rotation={[0, 0, 0.3]} scale={0.8} />
      <FloatingLightBulb
        position={[2, 1.5, 0]}
        rotation={[0, 0, 0]}
        scale={1}
      />
      <FloatingCodeSymbol
        position={[0, 2, 0]}
        rotation={[0, 0, 0]}
        scale={1.2}
      />
      <FloatingMentorIcon
        position={[0, -1, 0]}
        rotation={[0, 0, 0]}
        scale={1.1}
      />

      {/* Particle System */}
      <ParticleSystem count={150} />

      {/* Background Elements */}
      <mesh position={[0, 0, -5]} rotation={[0, 0, 0]}>
        <planeGeometry args={[20, 20]} />
        <meshStandardMaterial
          color={colors?.background?.secondary || "#f8f9fa"}
          transparent
          opacity={0.1}
        />
      </mesh>
    </>
  );
};

// Main Component
const MentorHero3D: React.FC = () => {
  const { colors } = useTheme();

  return (
    <div className="relative w-full h-[600px] overflow-hidden rounded-2xl">
      <Canvas
        camera={{ position: [0, 0, 8], fov: 60 }}
        shadows
        gl={{ antialias: true, alpha: true }}
        style={{
          background: `linear-gradient(135deg, ${
            colors?.background?.primary || "#ffffff"
          }, ${colors?.background?.secondary || "#f8f9fa"})`,
        }}
      >
        <MentorScene />
        <OrbitControls
          enableZoom={false}
          enablePan={false}
          autoRotate
          autoRotateSpeed={0.5}
          maxPolarAngle={Math.PI / 2}
          minPolarAngle={Math.PI / 3}
        />
      </Canvas>

      {/* Overlay Text */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <div className="text-center text-white drop-shadow-lg">
          <h2 className="text-2xl font-bold mb-2">Interactive Learning</h2>
          <p className="text-lg opacity-90">Explore our 3D mentor experience</p>
        </div>
      </div>
    </div>
  );
};

export default MentorHero3D;
