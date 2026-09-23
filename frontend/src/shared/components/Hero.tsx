import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useTheme } from "../../core/contexts/ThemeContext";
import { Code, Terminal, Database, Cpu, Zap, Rocket } from "lucide-react";

export const Hero = () => {
  const { colors } = useTheme();
  const [isLoading, setIsLoading] = useState(true);
  const [currentCodeIndex, setCurrentCodeIndex] = useState(0);

  const codeSnippets = [
    "const future = await code();",
    "function learn() { return 'success'; }",
    "if (dedication) { achieve(); }",
    "while (learning) { grow(); }",
  ];

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentCodeIndex((prev) => (prev + 1) % codeSnippets.length);
    }, 3000);

    return () => clearInterval(interval);
  }, [codeSnippets.length]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black">
        <div className="text-center">
          <div className="mb-6">
            <motion.div
              className="w-16 h-16 mx-auto border-4 border-green-500 rounded-full border-t-transparent"
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
            />
          </div>

          <motion.h2
            className="mb-4 text-2xl font-bold text-white"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
          >
            Initializing Code Environment...
          </motion.h2>

          <div className="flex justify-center space-x-2">
            {[0, 1, 2].map((i) => (
              <motion.div
                key={i}
                className="w-3 h-3 bg-green-500 rounded-full"
                animate={{ scale: [1, 1.5, 1] }}
                transition={{
                  duration: 1,
                  repeat: Infinity,
                  delay: i * 0.2,
                }}
              />
            ))}
          </div>

          <motion.div
            className="w-64 h-2 mx-auto mt-6 overflow-hidden bg-gray-700 rounded-full"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1 }}
          >
            <motion.div
              className="h-full bg-gradient-to-r from-green-500 to-green-400"
              initial={{ width: "0%" }}
              animate={{ width: "100%" }}
              transition={{ duration: 2, ease: "easeInOut" }}
            />
          </motion.div>
        </div>
      </div>
    );
  }

  return (
    <section className="relative flex items-center justify-center min-h-screen overflow-hidden bg-gradient-to-br from-gray-900 via-gray-800 to-black">
      <div className="absolute inset-0 bg-gradient-to-br from-green-900/20 via-transparent to-green-900/20" />

      <div className="relative z-10 max-w-6xl px-4 mx-auto text-center">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="mb-8"
        >
          <motion.h1
            className="mb-6 text-5xl font-bold md:text-7xl"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <span className="text-white">Code Your</span>
            <span
              className="block text-transparent bg-gradient-to-r bg-clip-text"
              style={{
                backgroundImage: `linear-gradient(to right, ${colors.accent.primary}, ${colors.accent.secondary}, ${colors.accent.success})`,
              }}
            >
              Future
            </span>
          </motion.h1>
        </motion.div>

        <motion.div
          className="mb-8"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.4 }}
        >
          <div className="max-w-2xl p-6 mx-auto border border-gray-700 rounded-lg bg-gray-800/50 backdrop-blur-sm">
            <motion.div
              key={currentCodeIndex}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.5 }}
              className="text-left"
            >
              <div className="flex items-center mb-3">
                <div className="flex space-x-2">
                  <div className="w-3 h-3 bg-red-500 rounded-full" />
                  <div className="w-3 h-3 bg-yellow-500 rounded-full" />
                  <div className="w-3 h-3 bg-green-500 rounded-full" />
                </div>
                <span className="ml-3 text-sm text-gray-400">code.js</span>
              </div>
              <pre className="font-mono text-lg text-green-400">
                <code>{codeSnippets[currentCodeIndex]}</code>
              </pre>
            </motion.div>
          </div>
        </motion.div>

        <motion.p
          className="max-w-3xl mx-auto mb-12 text-xl text-gray-300"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
        >
          Master coding skills through personalized mentorship, collaborative
          learning, and hands-on projects. Join a community of developers
          building the future.
        </motion.p>

        <motion.div
          className="flex flex-col justify-center gap-4 mb-16 sm:flex-row"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.8 }}
        >
          <motion.button
            className="px-8 py-4 text-lg font-semibold transition-all duration-300 border-2 rounded-lg hover:scale-105"
            style={{
              color: colors.accent.primary,
              borderColor: colors.accent.primary,
              backgroundColor: `${colors.accent.primary}10`,
            }}
            whileHover={{
              backgroundColor: `${colors.accent.primary}20`,
              boxShadow: `0 0 20px ${colors.accent.primary}40`,
            }}
          >
            View Projects
          </motion.button>

          <motion.button
            className="px-8 py-4 text-lg font-semibold transition-all duration-300 rounded-lg hover:scale-105"
            style={{
              backgroundColor: colors.accent.secondary,
              color: "white",
            }}
            whileHover={{
              backgroundColor: colors.accent.primary,
              boxShadow: `0 0 20px ${colors.accent.secondary}40`,
            }}
          >
            Join Sessions
          </motion.button>
        </motion.div>

        <motion.div
          className="grid grid-cols-2 gap-8 mb-16 md:grid-cols-4"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1 }}
        >
          {[
            { icon: Code, label: "Languages", value: "15+" },
            { icon: Terminal, label: "Projects", value: "50+" },
            { icon: Database, label: "Mentors", value: "25+" },
            { icon: Cpu, label: "Students", value: "200+" },
          ].map((stat, index) => (
            <motion.div
              key={stat.label}
              className="text-center"
              whileHover={{ scale: 1.05 }}
              transition={{ delay: index * 0.1 }}
            >
              <div className="flex justify-center mb-3">
                <stat.icon
                  className="w-8 h-8"
                  style={{ color: colors.accent.primary }}
                />
              </div>
              <div
                className="mb-1 text-3xl font-bold"
                style={{ color: colors.accent.secondary }}
              >
                {stat.value}
              </div>
              <div className="text-gray-400">{stat.label}</div>
            </motion.div>
          ))}
        </motion.div>

        <motion.div
          className="mb-16"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1.2 }}
        >
          <h3 className="mb-6 text-xl text-gray-300">
            Master Popular Technologies
          </h3>
          <div className="flex flex-wrap justify-center gap-4">
            {[
              "JavaScript",
              "Python",
              "React",
              "Node.js",
              "TypeScript",
              "Java",
              "C++",
              "Go",
              "Rust",
              "Swift",
            ].map((tech, index) => (
              <motion.div
                key={tech}
                className="px-4 py-2 transition-all duration-300 border rounded-full"
                style={{
                  borderColor: colors.accent.primary,
                  backgroundColor: `${colors.accent.primary}10`,
                }}
                whileHover={{
                  backgroundColor: `${colors.accent.primary}20`,
                  scale: 1.05,
                }}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 1.4 + index * 0.1 }}
              >
                <span
                  className="text-sm font-medium"
                  style={{ color: colors.accent.primary }}
                >
                  {tech}
                </span>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>

      <div className="absolute inset-0 pointer-events-none">
        {[
          { icon: Zap, x: "10%", y: "20%" },
          { icon: Rocket, x: "85%", y: "30%" },
          { icon: Cpu, x: "15%", y: "70%" },
          { icon: Database, x: "80%", y: "75%" },
        ].map((item, index) => (
          <motion.div
            key={index}
            className="absolute"
            style={{ left: item.x, top: item.y }}
            animate={{
              y: [0, -20, 0],
              rotate: [0, 5, -5, 0],
            }}
            transition={{
              duration: 4,
              repeat: Infinity,
              delay: index * 0.5,
            }}
          >
            <item.icon
              className="w-8 h-8 opacity-20"
              style={{ color: colors.accent.primary }}
            />
          </motion.div>
        ))}
      </div>
    </section>
  );
};
