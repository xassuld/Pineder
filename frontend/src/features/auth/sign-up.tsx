import { motion } from "framer-motion";
import { Button } from "../../design/system/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../../design/system/card";
import { Sprout, Sparkles, TrendingUp, Users, ArrowRight } from "lucide-react";
import { useState, useEffect } from "react";
import { Layout } from "../../components/layout/Layout";
import { SignUp } from "@clerk/nextjs";
import Link from "next/link";
import Head from "next/head";

export default function SignUpPage() {
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [currentTheme, setCurrentTheme] = useState(4);

  useEffect(() => {
    const checkDarkMode = () => {
      const theme = localStorage.getItem("pico-theme");
      const darkMode = localStorage.getItem("pico-dark-mode");
      const defaultTheme = localStorage.getItem("pico-default-theme");
      const defaultDarkMode = localStorage.getItem("pico-default-dark-mode");

      let isDarkMode = true; // Fallback to dark mode
      if (darkMode !== null) {
        isDarkMode = darkMode === "true";
      } else if (defaultDarkMode !== null) {
        isDarkMode = defaultDarkMode === "true";
      }

      setIsDarkMode(isDarkMode);

      if (theme !== null) {
        setCurrentTheme(parseInt(theme));
      } else if (defaultTheme !== null) {
        setCurrentTheme(parseInt(defaultTheme));
      }
    };

    const handleThemeChange = (event: Event) => {
      const customEvent = event as CustomEvent;
      if (customEvent.detail && customEvent.detail.theme) {
        setCurrentTheme(customEvent.detail.theme);
      }
      if (customEvent.detail && customEvent.detail.isDarkMode !== undefined) {
        setIsDarkMode(customEvent.detail.isDarkMode);
      }
    };

    checkDarkMode();
    window.addEventListener("themeChange", handleThemeChange);

    return () => {
      window.removeEventListener("themeChange", handleThemeChange);
    };
  }, []);

  const textColor = isDarkMode ? "text-white" : "text-gray-900";
  const mutedTextColor = isDarkMode ? "text-gray-300" : "text-gray-600";

  // Floating background elements
  const floatingIcons = [
    { icon: Sprout, x: "10%", y: "20%", delay: 0 },
    { icon: Sparkles, x: "85%", y: "15%", delay: 1 },
    { icon: TrendingUp, x: "15%", y: "80%", delay: 2 },
    { icon: Users, x: "80%", y: "75%", delay: 3 },
  ];

  return (
    <Layout className={`${isDarkMode ? "bg-[#0F0E0E]" : "bg-white"}`}>
      <Head>
        <title>Sign Up - Pinecone Mentorship Platform</title>
        <meta
          name="description"
          content="Create your account on Pinecone Mentorship Platform"
        />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>

      {/* Floating Background Elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        {floatingIcons.map((item, index) => (
          <motion.div
            key={index}
            className="absolute"
            style={{ left: item.x, top: item.y }}
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 0.1, scale: 1 }}
            transition={{ duration: 2, delay: item.delay }}
          >
            <item.icon
              className={`w-8 h-8 ${
                isDarkMode ? "text-white" : "text-gray-300"
              }`}
            />
          </motion.div>
        ))}
      </div>

      {/* Main Content */}
      <div className="relative z-10 flex items-center justify-center min-h-screen px-4 py-16 sm:px-6 lg:px-8">
        <div className="grid items-center w-full max-w-6xl grid-cols-1 gap-8 lg:grid-cols-2">
          {/* Left Side - Auth Form */}
          <div className="w-full max-w-md mx-auto">
            {/* Header */}
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="mb-8 text-center"
            >
              <motion.div
                className="flex items-center justify-center mb-4"
                whileHover={{ scale: 1.05 }}
                transition={{ type: "spring", stiffness: 400, damping: 17 }}
              >
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[var(--pico-secondary)] to-[var(--pico-accent)] flex items-center justify-center">
                  <Users className="text-white w-7 h-7" />
                </div>
              </motion.div>
              <div className="flex items-center justify-center mb-2 space-x-8">
                <Link
                  href="/"
                  className={`inline-flex items-center space-x-2 text-[var(--pico-primary)] hover:text-[var(--pico-secondary)] font-medium transition-colors duration-200`}
                >
                  <ArrowRight className="w-6 h-6 rotate-180" />
                </Link>
                <h1 className={`text-3xl font-bold ${textColor}`}>
                  Join Our Community
                </h1>
              </div>
              <p className={`text-lg ${mutedTextColor}`}>
                Create your account and start your mentorship journey
              </p>
            </motion.div>

            {/* Auth Card */}
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              <Card
                className={`w-full border-0 shadow-2xl glass-light ${
                  isDarkMode ? "bg-slate-900/80" : "bg-white/80"
                }`}
              >
                <CardHeader className="text-center">
                  <CardTitle className={`text-2xl font-bold ${textColor}`}>
                    Sign Up
                  </CardTitle>
                  <CardDescription className={mutedTextColor}>
                    Create your account to get started
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <SignUp
                    routing="hash"
                    appearance={{
                      elements: {
                        rootBox: "w-full",
                        card: "shadow-none bg-transparent",
                        headerTitle: "hidden",
                        headerSubtitle: "hidden",
                        socialButtonsBlockButton: `w-full bg-[var(--pico-primary)] hover:bg-[var(--pico-secondary)] text-white border-0 rounded-xl font-medium transition-all duration-200`,
                        formButtonPrimary: `w-full bg-gradient-to-r from-[var(--pico-primary)] to-[var(--pico-secondary)] hover:from-[var(--pico-secondary)] hover:to-[var(--pico-accent)] text-white border-0 rounded-xl font-medium transition-all duration-200`,
                        formFieldInput: `w-full bg-background/50 border border-border/50 rounded-xl focus:border-[var(--pico-primary)] focus:ring-[var(--pico-primary)] transition-all duration-200`,
                        formFieldLabel: `${textColor} font-medium`,
                        footerActionLink: `text-[var(--pico-primary)] hover:text-[var(--pico-secondary)] transition-colors duration-200`,
                        dividerLine: "bg-border/50",
                        dividerText: mutedTextColor,
                      },
                    }}
                  />
                </CardContent>
              </Card>
            </motion.div>

            {/* Back to Home and Sign In Link */}
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.6 }}
              className="mt-6 space-y-4 text-center"
            >
              <div>
                <Link
                  href="/"
                  className={`inline-flex items-center space-x-2 text-[var(--pico-primary)] hover:text-[var(--pico-secondary)] font-medium transition-colors duration-200`}
                >
                  <ArrowRight className="w-4 h-4 rotate-180" />
                  <span>Back to Home</span>
                </Link>
              </div>
              <div>
                <span className={`${mutedTextColor}`}>
                  Already have an account?{" "}
                </span>
                <Link
                  href="/auth/sign-in"
                  className={`text-[var(--pico-primary)] hover:text-[var(--pico-secondary)] font-medium transition-colors duration-200`}
                >
                  Sign in
                </Link>
              </div>
            </motion.div>
          </div>

          {/* Right Side - Abstract Image */}
          <motion.div
            initial={{ x: 50, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="items-center justify-center hidden lg:flex"
          >
            <div className="relative w-full max-w-lg">
              {/* Abstract Image Container */}
              <div className="relative w-full overflow-hidden shadow-2xl h-96 rounded-2xl">
                {/* Abstract Background */}
                <div className="absolute inset-0 bg-gradient-to-br from-[var(--pico-primary)]/20 via-[var(--pico-secondary)]/20 to-[var(--pico-accent)]/20">
                  {/* Abstract SVG Pattern */}
                  <svg
                    className="absolute inset-0 w-full h-full opacity-30"
                    viewBox="0 0 400 400"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    {/* Abstract Shapes */}
                    <defs>
                      <linearGradient
                        id="grad1"
                        x1="0%"
                        y1="0%"
                        x2="100%"
                        y2="100%"
                      >
                        <stop
                          offset="0%"
                          style={{
                            stopColor: "var(--pico-primary)",
                            stopOpacity: 0.6,
                          }}
                        />
                        <stop
                          offset="100%"
                          style={{
                            stopColor: "var(--pico-secondary)",
                            stopOpacity: 0.6,
                          }}
                        />
                      </linearGradient>
                      <linearGradient
                        id="grad2"
                        x1="100%"
                        y1="0%"
                        x2="0%"
                        y2="100%"
                      >
                        <stop
                          offset="0%"
                          style={{
                            stopColor: "var(--pico-secondary)",
                            stopOpacity: 0.4,
                          }}
                        />
                        <stop
                          offset="100%"
                          style={{
                            stopColor: "var(--pico-accent)",
                            stopOpacity: 0.4,
                          }}
                        />
                      </linearGradient>
                      <linearGradient
                        id="grad3"
                        x1="50%"
                        y1="0%"
                        x2="50%"
                        y2="100%"
                      >
                        <stop
                          offset="0%"
                          style={{
                            stopColor: "var(--pico-accent)",
                            stopOpacity: 0.3,
                          }}
                        />
                        <stop
                          offset="100%"
                          style={{
                            stopColor: "var(--pico-primary)",
                            stopOpacity: 0.3,
                          }}
                        />
                      </linearGradient>
                    </defs>

                    {/* Floating Circles */}
                    <circle
                      cx="80"
                      cy="80"
                      r="40"
                      fill="url(#grad1)"
                      opacity="0.7"
                    >
                      <animate
                        attributeName="r"
                        values="40;50;40"
                        dur="4s"
                        repeatCount="indefinite"
                      />
                    </circle>
                    <circle
                      cx="320"
                      cy="120"
                      r="30"
                      fill="url(#grad2)"
                      opacity="0.6"
                    >
                      <animate
                        attributeName="r"
                        values="30;40;30"
                        dur="3s"
                        repeatCount="indefinite"
                      />
                    </circle>
                    <circle
                      cx="200"
                      cy="300"
                      r="35"
                      fill="url(#grad3)"
                      opacity="0.5"
                    >
                      <animate
                        attributeName="r"
                        values="35;45;35"
                        dur="5s"
                        repeatCount="indefinite"
                      />
                    </circle>

                    {/* Abstract Lines */}
                    <path
                      d="M 50 200 Q 150 100 250 200 T 350 200"
                      stroke="url(#grad1)"
                      strokeWidth="3"
                      fill="none"
                      opacity="0.4"
                    >
                      <animate
                        attributeName="d"
                        values="M 50 200 Q 150 100 250 200 T 350 200;M 50 200 Q 150 300 250 200 T 350 200;M 50 200 Q 150 100 250 200 T 350 200"
                        dur="6s"
                        repeatCount="indefinite"
                      />
                    </path>

                    {/* Geometric Shapes */}
                    <polygon
                      points="100,150 150,100 200,150 150,200"
                      fill="url(#grad2)"
                      opacity="0.3"
                    >
                      <animateTransform
                        attributeName="transform"
                        type="rotate"
                        values="0 150 150;360 150 150"
                        dur="8s"
                        repeatCount="indefinite"
                      />
                    </polygon>

                    {/* Abstract Waves */}
                    <path
                      d="M 0 250 Q 100 200 200 250 T 400 250"
                      stroke="url(#grad3)"
                      strokeWidth="2"
                      fill="none"
                      opacity="0.3"
                    >
                      <animate
                        attributeName="d"
                        values="M 0 250 Q 100 200 200 250 T 400 250;M 0 250 Q 100 300 200 250 T 400 250;M 0 250 Q 100 200 200 250 T 400 250"
                        dur="7s"
                        repeatCount="indefinite"
                      />
                    </path>
                  </svg>
                </div>

                {/* Overlay Content */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="relative z-10 text-center">
                    {/* Abstract Icon */}
                    <motion.div
                      className="w-24 h-24 mx-auto mb-6 rounded-full bg-gradient-to-br from-[var(--pico-primary)] to-[var(--pico-secondary)] flex items-center justify-center shadow-lg backdrop-blur-sm"
                      whileHover={{ scale: 1.1, rotate: 5 }}
                      transition={{
                        type: "spring",
                        stiffness: 300,
                        damping: 20,
                      }}
                    >
                      <Users className="w-12 h-12 text-white" />
                    </motion.div>

                    {/* Text */}
                    <h3 className={`text-2xl font-bold ${textColor} mb-2`}>
                      Join Our Community
                    </h3>
                    <p
                      className={`text-lg ${mutedTextColor} max-w-md mx-auto px-4`}
                    >
                      Connect with mentors and grow together in our supportive
                      community
                    </p>

                    {/* Abstract Decorative Elements */}
                    <div className="flex justify-center mt-6 space-x-4">
                      <motion.div
                        className="w-3 h-3 rounded-full bg-[var(--pico-primary)]"
                        animate={{
                          scale: [1, 1.2, 1],
                          rotate: [0, 180, 360],
                        }}
                        transition={{
                          duration: 3,
                          repeat: Infinity,
                          delay: 0,
                        }}
                      ></motion.div>
                      <motion.div
                        className="w-3 h-3 rounded-full bg-[var(--pico-secondary)]"
                        animate={{
                          scale: [1, 1.2, 1],
                          rotate: [0, -180, -360],
                        }}
                        transition={{
                          duration: 3,
                          repeat: Infinity,
                          delay: 0.5,
                        }}
                      ></motion.div>
                      <motion.div
                        className="w-3 h-3 rounded-full bg-[var(--pico-accent)]"
                        animate={{
                          scale: [1, 1.2, 1],
                          rotate: [0, 180, 360],
                        }}
                        transition={{
                          duration: 3,
                          repeat: Infinity,
                          delay: 1,
                        }}
                      ></motion.div>
                    </div>
                  </div>
                </div>

                {/* Floating Abstract Elements */}
                <motion.div
                  className="absolute top-4 right-4 w-16 h-16 rounded-full bg-[var(--pico-accent)]/30 flex items-center justify-center backdrop-blur-sm"
                  animate={{ y: [0, -10, 0], rotate: [0, 180, 360] }}
                  transition={{ duration: 4, repeat: Infinity }}
                >
                  <Sparkles className="w-8 h-8 text-[var(--pico-accent)]" />
                </motion.div>
                <motion.div
                  className="absolute bottom-4 left-4 w-12 h-12 rounded-full bg-[var(--pico-primary)]/30 flex items-center justify-center backdrop-blur-sm"
                  animate={{ y: [0, 10, 0], rotate: [0, -180, -360] }}
                  transition={{ duration: 4, repeat: Infinity, delay: 1.5 }}
                >
                  <TrendingUp className="w-6 h-6 text-[var(--pico-primary)]" />
                </motion.div>

                {/* Additional Abstract Elements */}
                <motion.div
                  className="absolute top-1/4 left-4 w-8 h-8 rounded-full bg-[var(--pico-secondary)]/20 flex items-center justify-center"
                  animate={{ rotate: [0, 360], scale: [1, 1.2, 1] }}
                  transition={{
                    duration: 8,
                    repeat: Infinity,
                    ease: "linear",
                  }}
                >
                  <div className="w-2 h-2 rounded-full bg-[var(--pico-secondary)]"></div>
                </motion.div>
                <motion.div
                  className="absolute bottom-1/4 right-4 w-6 h-6 rounded-full bg-[var(--pico-primary)]/20 flex items-center justify-center"
                  animate={{ rotate: [0, -360], scale: [1, 0.8, 1] }}
                  transition={{
                    duration: 6,
                    repeat: Infinity,
                    ease: "linear",
                  }}
                >
                  <div className="w-1.5 h-1.5 rounded-full bg-[var(--pico-primary)]"></div>
                </motion.div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </Layout>
  );
}
