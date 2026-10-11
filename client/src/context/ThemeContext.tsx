import React, { createContext, useContext, useState, useEffect } from "react";

export type ThemeId = "emerald" | "indigo" | "lime" | "ocean" | "coral" | "rose";

export interface ThemeConfig {
  id: ThemeId;
  name: string;
  subtitle: string;
  primaryHex: string;
  primaryHoverHex: string;
  lightBgHex: string;
  previewColors: string[];
}

export const AVAILABLE_THEMES: ThemeConfig[] = [
  {
    id: "emerald",
    name: "Emerald Mint",
    subtitle: "Fresh health & balanced nutrition (Default)",
    primaryHex: "#10B981",
    primaryHoverHex: "#059669",
    lightBgHex: "#ECFDF5",
    previewColors: ["#10B981", "#34D399", "#A7F3D0"],
  },
  {
    id: "indigo",
    name: "Royal Indigo",
    subtitle: "Modern fitness UI kit & deep purple accents",
    primaryHex: "#6366F1",
    primaryHoverHex: "#4F46E5",
    lightBgHex: "#EEF2FF",
    previewColors: ["#6366F1", "#818CF8", "#C7D2FE"],
  },
  {
    id: "lime",
    name: "Nutrio Lime",
    subtitle: "High-energy lime fitness & vitality",
    primaryHex: "#84CC16",
    primaryHoverHex: "#65A30D",
    lightBgHex: "#F7FEE7",
    previewColors: ["#84CC16", "#A3E635", "#D9F99D"],
  },
  {
    id: "ocean",
    name: "Ocean Cyan",
    subtitle: "Calm executive blue & hydration focus",
    primaryHex: "#0EA5E9",
    primaryHoverHex: "#0284C7",
    lightBgHex: "#F0F9FF",
    previewColors: ["#0EA5E9", "#38BDF8", "#BAE6FD"],
  },
  {
    id: "coral",
    name: "Sunset Coral",
    subtitle: "Warm energetic calorie burn & performance",
    primaryHex: "#F97316",
    primaryHoverHex: "#EA580C",
    lightBgHex: "#FFF7ED",
    previewColors: ["#F97316", "#FB923C", "#FED7AA"],
  },
  {
    id: "rose",
    name: "Rose Berry",
    subtitle: "Vibrant berry & modern wellness aesthetic",
    primaryHex: "#F43F5E",
    primaryHoverHex: "#E11D48",
    lightBgHex: "#FFF1F2",
    previewColors: ["#F43F5E", "#FB7185", "#FECDD3"],
  },
];

interface ThemeContextType {
  theme: ThemeId;
  setTheme: (theme: ThemeId) => void;
  currentTheme: ThemeConfig;
  availableThemes: ThemeConfig[];
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

const THEME_STORAGE_KEY = "nutritrack_color_theme";

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [theme, setThemeState] = useState<ThemeId>(() => {
    const saved = localStorage.getItem(THEME_STORAGE_KEY) as ThemeId;
    return AVAILABLE_THEMES.some((t) => t.id === saved) ? saved : "emerald";
  });

  const setTheme = (newTheme: ThemeId) => {
    setThemeState(newTheme);
    localStorage.setItem(THEME_STORAGE_KEY, newTheme);
  };

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
  }, [theme]);

  const currentTheme = AVAILABLE_THEMES.find((t) => t.id === theme) || AVAILABLE_THEMES[0];

  return (
    <ThemeContext.Provider
      value={{
        theme,
        setTheme,
        currentTheme,
        availableThemes: AVAILABLE_THEMES,
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = (): ThemeContextType => {
  const context = useContext(ThemeContext);
  if (!context) {
    return {
      theme: "emerald",
      setTheme: () => {},
      currentTheme: AVAILABLE_THEMES[0],
      availableThemes: AVAILABLE_THEMES,
    };
  }
  return context;
};
