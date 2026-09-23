import { motion } from "framer-motion";
import { Canvas } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import { useTheme } from "../../core/contexts/ThemeContext";
import { Model3D } from "./Model3D";

export const Hero3DModel = () => {
  const { colors } = useTheme();

  return (
    <motion.div
      initial={{ opacity: 0, x: 50 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.8, delay: 0.3 }}
      className="relative h-[500px] lg:h-[600px] w-full"
    >
      {/* Floating decorative elements */}
      <div className="absolute inset-0 pointer-events-none">
        {/* Floating circles */}
        <motion.div
          className="absolute w-4 h-4 rounded-full pointer-events-none opacity-40"
          style={{
            left: "10%",
            top: "20%",
            backgroundColor: colors.accent.primary,
          }}
          animate={{
            y: [0, -20, 0],
            scale: [1, 1.3, 1],
            rotate: [0, 180, 360],
          }}
          transition={{
            duration: 4,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
        <motion.div
          className="absolute w-3 h-3 rounded-full pointer-events-none opacity-35"
          style={{
            left: "85%",
            top: "30%",
            backgroundColor: colors.accent.secondary,
          }}
          animate={{
            y: [0, -25, 0],
            scale: [1, 1.4, 1],
            rotate: [0, -180, -360],
          }}
          transition={{
            duration: 5,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 1,
          }}
        />
        <motion.div
          className="absolute w-2 h-2 rounded-full opacity-50 pointer-events-none"
          style={{
            left: "70%",
            top: "70%",
            backgroundColor: colors.accent.success,
          }}
          animate={{
            y: [0, -15, 0],
            scale: [1, 1.6, 1],
            rotate: [0, 90, 180],
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 2,
          }}
        />

        {/* Additional floating elements */}
        <motion.div
          className="absolute w-6 h-6 border-2 rounded-full pointer-events-none opacity-30"
          style={{
            left: "25%",
            top: "80%",
            borderColor: colors.accent.primary,
          }}
          animate={{
            y: [0, -30, 0],
            scale: [1, 1.2, 1],
            rotate: [0, 360],
          }}
          transition={{
            duration: 6,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 0.5,
          }}
        />
        <motion.div
          className="absolute w-5 h-5 border-2 border-dashed rounded-full opacity-25 pointer-events-none"
          style={{
            right: "25%",
            top: "15%",
            borderColor: colors.accent.secondary,
          }}
          animate={{
            y: [0, -18, 0],
            scale: [1, 1.1, 1],
            rotate: [0, -360],
          }}
          transition={{
            duration: 4.5,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 1.5,
          }}
        />

        {/* Glow effects */}
        <div
          className="absolute w-40 h-40 rounded-full pointer-events-none blur-3xl opacity-15"
          style={{
            left: "20%",
            top: "40%",
            backgroundColor: colors.accent.primary,
          }}
        />
        <div
          className="absolute w-32 h-32 rounded-full pointer-events-none blur-2xl opacity-12"
          style={{
            right: "15%",
            bottom: "30%",
            backgroundColor: colors.accent.secondary,
          }}
        />
        <div
          className="absolute w-24 h-24 rounded-full pointer-events-none blur-xl opacity-10"
          style={{
            left: "60%",
            top: "10%",
            backgroundColor: colors.accent.success,
          }}
        />

        {/* Animated lines */}
        <motion.div
          className="absolute w-20 h-0.5 opacity-20 pointer-events-none"
          style={{
            left: "5%",
            top: "60%",
            backgroundColor: colors.accent.primary,
          }}
          animate={{
            scaleX: [0, 1, 0],
            opacity: [0, 0.3, 0],
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
        <motion.div
          className="absolute w-16 h-0.5 opacity-20 pointer-events-none"
          style={{
            right: "10%",
            top: "25%",
            backgroundColor: colors.accent.secondary,
          }}
          animate={{
            scaleX: [0, 1, 0],
            opacity: [0, 0.3, 0],
          }}
          transition={{
            duration: 2.5,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 1.5,
          }}
        />

        {/* Floating dots */}
        {[...Array(8)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 rounded-full pointer-events-none opacity-40"
            style={{
              left: `${15 + ((i * 10) % 70)}%`,
              top: `${20 + ((i * 12) % 60)}%`,
              backgroundColor: colors.accent.primary,
            }}
            animate={{
              y: [0, -8, 0],
              opacity: [0.4, 0.8, 0.4],
            }}
            transition={{
              duration: 2 + Math.random() * 2,
              repeat: Infinity,
              delay: Math.random() * 2,
            }}
          />
        ))}
      </div>

      {/* 3D Canvas */}
      <div className="relative z-10 w-full h-full">
        <Canvas
          camera={{ position: [0, 0, 5], fov: 75 }}
          gl={{
            antialias: true,
            alpha: true,
            powerPreference: "high-performance",
            stencil: false,
            depth: true,
          }}
          style={{
            background: "transparent",
            borderRadius: "12px",
          }}
          onWheel={(e) => {
            // Allow scrolling when not interacting with 3D model
            if (!e.ctrlKey) {
              e.stopPropagation();
            }
          }}
        >
          {/* Enhanced lighting for better quality */}
          <ambientLight intensity={0.8} />
          <directionalLight position={[10, 10, 5]} intensity={1.2} />
          <directionalLight position={[-10, -10, -5]} intensity={0.8} />
          <pointLight position={[0, 10, 0]} intensity={0.5} />
          <pointLight position={[0, -10, 0]} intensity={0.3} />

          <Model3D />
          <OrbitControls
            enableZoom={false}
            enablePan={false}
            enableRotate={true}
            maxDistance={15}
            minDistance={2}
            zoomSpeed={0.5}
            enableDamping={true}
            dampingFactor={0.05}
          />
        </Canvas>
      </div>
    </motion.div>
  );
};
