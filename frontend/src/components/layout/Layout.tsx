"use client";

import { ReactNode, useEffect, useState } from "react";
import { Navigation } from "./Navigation";
import { Footer } from "./Footer";
import { useTheme } from "../../core/contexts/ThemeContext";

interface LayoutProps {
  children: ReactNode;
  showFooter?: boolean;
  className?: string;
}

export function Layout({
  children,
  showFooter = true,
  className = "",
}: LayoutProps) {
  const { colors } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Use default colors during SSR to prevent hydration mismatch
  const defaultColors = {
    background: {
      primary: "#ffffff", // Default to white background
    },
  };

  const currentColors = mounted ? colors : defaultColors;

  return (
    <div
      className={`min-h-screen transition-none ${className}`}
      style={{ backgroundColor: currentColors.background.primary }}
    >
      <Navigation />
      <main
        className={`${showFooter ? "pb-8" : ""}`}
        style={{ backgroundColor: currentColors.background.primary }}
      >
        {children}
      </main>
      {showFooter && <Footer />}
    </div>
  );
}

// Convenience components for common layouts
export function PageLayout({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  return <Layout className={className}>{children}</Layout>;
}

export function DashboardLayout({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <Layout showFooter={false} className={className}>
      {children}
    </Layout>
  );
}

export function AuthLayout({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <Layout showFooter={false} className={className}>
      {children}
    </Layout>
  );
}
