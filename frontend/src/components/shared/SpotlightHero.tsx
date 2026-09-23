import { motion } from "framer-motion";
import { useTheme } from "../../core/contexts/ThemeContext";
import { LogoLoader } from "./LogoLoader";

interface SpotlightHeroProps {
  title: string;
  subtitle?: string;
  description: string;
  quote?: string;
  author?: string;
}

export const SpotlightHero = ({
  title,
  subtitle,
  description,
  quote,
  author,
}: SpotlightHeroProps) => {
  const { colors, isDarkMode } = useTheme();

  return (
    <section className="relative flex items-center justify-center min-h-screen overflow-hidden">
      {/* Gradient Background */}
      <div
        className="absolute inset-0 transition-all duration-500"
        style={{
          background: `linear-gradient(135deg, ${colors.background.primary} 0%, ${colors.background.secondary} 50%, ${colors.background.tertiary} 100%)`,
        }}
      />

      {/* Main Content Panel */}
      <div className="relative z-10 px-4 py-20 mx-auto max-w-7xl">
        <div className="relative">
          {/* Top Left Text */}
          <motion.div
            initial={{ opacity: 0, x: -50, y: -30 }}
            animate={{ opacity: 1, x: 0, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="absolute top-0 left-0 text-left"
          >
            <div className="space-y-2">
              <div
                className="text-lg font-light tracking-widest"
                style={{ color: colors.text.primary }}
              >
                ILLUMINATE
              </div>
              <div
                className="text-lg font-light tracking-widest"
                style={{ color: colors.text.primary }}
              >
                YOUR PATH
              </div>
              <div
                className="text-lg font-light tracking-widest"
                style={{ color: colors.text.primary }}
              >
                TO SUCCESS
              </div>
            </div>
          </motion.div>

          {/* Central Content */}
          <div className="relative text-center">
            {/* Logo Loader */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="mb-12"
            >
              <LogoLoader message="Growing your knowledge... 🌱" size="lg" />
            </motion.div>

            {/* Subtitle */}
            {subtitle && (
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.6 }}
                className="mb-8"
              >
                <span
                  className="text-4xl font-light tracking-widest md:text-6xl"
                  style={{
                    color: colors.text.primary,
                    textShadow: `0 0 20px ${colors.accent.primary}40`,
                  }}
                >
                  {subtitle}
                </span>
              </motion.div>
            )}

            {/* Main Title */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.8 }}
              className="relative mb-8"
            >
              <h1
                className="text-6xl font-black tracking-tight md:text-8xl lg:text-9xl"
                style={{ color: colors.text.primary }}
              >
                {title}
              </h1>
            </motion.div>

            {/* Description */}
            <motion.p
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 1.0 }}
              className="max-w-4xl mx-auto text-xl leading-relaxed md:text-2xl"
              style={{ color: colors.text.secondary }}
            >
              {description}
            </motion.p>
          </div>

          {/* Bottom Left Quote */}
          {quote && (
            <motion.div
              initial={{ opacity: 0, x: -50, y: 30 }}
              animate={{ opacity: 1, x: 0, y: 0 }}
              transition={{ duration: 0.8, delay: 1.2 }}
              className="absolute bottom-0 left-0 flex items-start space-x-4"
            >
              {/* Large Quotation Mark */}
              <div
                className="font-light text-8xl md:text-9xl opacity-20"
                style={{
                  color: colors.text.primary,
                  textShadow: `0 0 30px ${colors.accent.primary}40`,
                }}
              >
                &quot;
              </div>

              {/* Quote Text */}
              <div className="max-w-md space-y-2">
                <p
                  className="text-sm font-light leading-relaxed md:text-base"
                  style={{ color: colors.text.secondary }}
                >
                  {quote}
                </p>
                {author && (
                  <p
                    className="text-sm font-medium"
                    style={{ color: colors.accent.primary }}
                  >
                    — {author}
                  </p>
                )}
              </div>
            </motion.div>
          )}

          {/* Bottom Right Corner Detail */}
          <motion.div
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 1.4 }}
            className="absolute bottom-0 right-0"
          >
            <div
              className="w-8 h-8 border-2 rounded-sm"
              style={{
                borderColor: colors.text.primary,
                opacity: 0.3,
              }}
            />
          </motion.div>
        </div>
      </div>
    </section>
  );
};
