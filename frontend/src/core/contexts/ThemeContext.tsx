"use client";
import React, { createContext, useContext, useEffect, useState } from "react";

export type Theme = "light" | "dark";
export type ColorTheme =
  | "default"
  | "original"
  | "nature"
  | "fresh"
  | "forest"
  | "ocean"
  | "vibrant";

// Centralized theme configuration - update colors here for the entire app
export const themeConfig = {
  light: {
    // Background colors - Minimal white and light gray
    background: {
      primary: "#ffffff", // Pure white
      secondary: "#f8f9fa", // Very light gray
      tertiary: "#e9ecef", // Light gray
      card: "#ffffff", // White cards
      cardHover: "#f8f9fa", // Light hover
      modal: "#ffffff", // White modals
      modalOverlay: "rgba(0, 0, 0, 0.1)", // Semi-transparent black
      input: "#ffffff", // White input backgrounds
    },
    // Text colors - Black and dark gray
    text: {
      primary: "#000000", // Black (main text)
      secondary: "#495057", // Dark gray
      tertiary: "#6c757d", // Medium gray
      muted: "#adb5bd", // Light gray
      inverse: "#ffffff", // White text on dark backgrounds
    },
    // Border colors - Single consistent color
    border: {
      primary: "#dee2e6", // Light gray borders
      secondary: "#dee2e6", // Same as primary
      accent: "#70e000", // Green accent borders (default theme)
      focus: "#70e000", // Green focus borders (default theme)
    },
    // Accent colors - Green only
    accent: {
      primary: "#70e000", // Green (main accent) - default theme
      secondary: "#70e000", // Green (secondary) - default theme
      success: "#70e000", // Green (success) - default theme
      warning: "#ffc107", // Yellow warning
      error: "#dc3545", // Red error
      info: "#6c757d", // Gray info
    },
    // Navigation colors
    navigation: {
      background: "#ffffff", // White nav background
      border: "#dee2e6", // Consistent border color
      text: "#000000", // Black text
      textHover: "#70e000", // Green hover text (default theme)
      buttonHover: "#70e000", // Green hover background (default theme)
      linkHover: "#70e000", // Green link hover (default theme)
    },
    // Button colors
    button: {
      primary: "#70e000", // Green primary buttons (default theme)
      primaryHover: "#5bb800", // Darker green hover (default theme)
      secondary: "#e9ecef", // Light gray secondary
      secondaryHover: "#dee2e6", // Medium gray hover
      outline: "#dee2e6", // Light gray outline
      outlineHover: "#ced4da", // Medium gray outline hover
    },
    // Shadow colors
    shadow: {
      small: "0 1px 2px 0 rgba(0, 0, 0, 0.05)", // Subtle shadows
      medium: "0 4px 6px -1px rgba(0, 0, 0, 0.1)", // Medium shadows
      large: "0 10px 15px -3px rgba(0, 0, 0, 0.1)", // Large shadows
    },
  },
  dark: {
    // Background colors - Dark and black
    background: {
      primary: "#0F0E0E", // Very dark background (user requested)
      secondary: "#1a1a1a", // Very dark gray
      tertiary: "#2d2d2d", // Dark gray
      card: "#0F0E0E", // Dark card background
      cardHover: "#2d2d2d", // Darker hover
      modal: "#0F0E0E", // Dark modal background
      modalOverlay: "rgba(0, 0, 0, 0.5)", // Semi-transparent black
      input: "#1a1a1a", // Dark input backgrounds
    },
    // Text colors - White and light gray
    text: {
      primary: "#ffffff", // White (main text)
      secondary: "#e9ecef", // Light gray
      tertiary: "#ced4da", // Medium light gray
      muted: "#adb5bd", // Medium gray
      inverse: "#000000", // Black text on light backgrounds
    },
    // Border colors - Single consistent color
    border: {
      primary: "#495057", // Dark gray borders
      secondary: "#495057", // Same as primary
      accent: "#70e000", // Green accent borders (default theme)
      focus: "#70e000", // Green focus borders (default theme)
    },
    // Accent colors - Green only
    accent: {
      primary: "#70e000", // Green (main accent) - default theme
      secondary: "#70e000", // Green (secondary) - default theme
      success: "#70e000", // Green (success) - default theme
      warning: "#ffc107", // Yellow warning
      error: "#dc3545", // Red error
      info: "#6c757d", // Gray info
    },
    // Navigation colors
    navigation: {
      background: "#222222", // Dark gray background
      border: "#495057", // Consistent border color
      text: "#ffffff", // White text
      textHover: "#70e000", // Green hover (default theme)
      buttonHover: "#70e000", // Green button hover (default theme)
      linkHover: "#70e000", // Green link hover (default theme)
    },
    // Button colors
    button: {
      primary: "#70e000", // Green primary buttons (default theme)
      primaryHover: "#5bb800", // Darker green hover (default theme)
      secondary: "#2d2d2d", // Dark gray secondary
      secondaryHover: "#495057", // Medium dark gray hover
      outline: "#495057", // Dark gray outline
      outlineHover: "#6c757d", // Medium gray outline hover
    },
    // Shadow colors
    shadow: {
      small: "0 1px 2px 0 rgba(0, 0, 0, 0.3)", // ⚫ Dark shadows
      medium: "0 4px 6px -1px rgba(0, 0, 0, 0.4)", // ⚫ Medium dark shadows
      large: "0 10px 15px -3px rgba(0, 0, 0, 0.4)", // ⚫ Large dark shadows
    },
  },
};

interface ThemeContextType {
  theme: Theme;
  colorTheme: ColorTheme;
  toggleTheme: () => void;
  setColorTheme: (theme: ColorTheme) => void;
  isDarkMode: boolean;
  colors: typeof themeConfig.light | typeof themeConfig.dark;
  getAccentColor: () => string;
  getAccentColorWithOpacity: (opacity: number) => string;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useState<Theme>("dark");
  const [colorTheme, setColorTheme] = useState<ColorTheme>("default");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    // Set mounted to true after component mounts on client
    setMounted(true);

    // Load theme from localStorage on mount
    const savedTheme = localStorage.getItem("pineder-theme") as Theme;
    const savedColorTheme = localStorage.getItem(
      "pineder-color-theme"
    ) as ColorTheme;

    if (savedTheme) {
      setTheme(savedTheme);
    }
    if (savedColorTheme) {
      setColorTheme(savedColorTheme);
    }
  }, []);

  useEffect(() => {
    // Only apply theme changes after component has mounted
    if (!mounted) return;

    // Apply theme to document
    const root = document.documentElement;

    if (theme === "light") {
      root.classList.add("light");
    } else {
      root.classList.remove("light");
    }

    // Apply color theme
    root.setAttribute("data-color-theme", colorTheme);

    // Save to localStorage
    localStorage.setItem("pineder-theme", theme);
    localStorage.setItem("pineder-color-theme", colorTheme);
  }, [theme, colorTheme, mounted]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === "light" ? "dark" : "light"));
  };

  const changeColorTheme = (newColorTheme: ColorTheme) => {
    setColorTheme(newColorTheme);
  };

  // Function to get accent color based on color theme
  const getAccentColor = () => {
    return colorTheme === "original" ? "#1a759f" : "#70e000";
  };

  // Function to get accent color with opacity
  const getAccentColorWithOpacity = (opacity: number) => {
    const baseColor = getAccentColor();
    if (baseColor === "#1a759f") {
      // Convert blue to rgba
      return `rgba(26, 117, 159, ${opacity})`;
    } else {
      // Convert green to rgba
      return `rgba(112, 224, 0, ${opacity})`;
    }
  };

  // Get current theme colors
  const colors = theme === "light" ? themeConfig.light : themeConfig.dark;

  const value: ThemeContextType = {
    theme,
    colorTheme,
    toggleTheme,
    setColorTheme: changeColorTheme,
    isDarkMode: theme !== "light",
    colors,
    getAccentColor,
    getAccentColorWithOpacity,
  };

  // Prevent hydration mismatch by not rendering until mounted
  if (!mounted) {
    return (
      <ThemeContext.Provider value={value}>
        <div
          className="min-h-screen transition-none"
          style={{ backgroundColor: colors.background.primary }}
        >
          {children}
        </div>
      </ThemeContext.Provider>
    );
  }

  return (
    <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
}
