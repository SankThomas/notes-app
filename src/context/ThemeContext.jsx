import { createContext, useContext, useEffect, useState } from "react";

const ThemeContext = createContext();

const themes = {
  blue: {
    primary: "blue-600",
    primaryHover: "blue-700",
    primaryLight: "blue-50",
    accent: "blue-100",
  },
  purple: {
    primary: "purple-600",
    primaryHover: "purple-700",
    primaryLight: "purple-50",
    accent: "purple-100",
  },
  green: {
    primary: "green-600",
    primaryHover: "green-700",
    primaryLight: "green-50",
    accent: "green-100",
  },
  orange: {
    primary: "orange-600",
    primaryHover: "orange-700",
    primaryLight: "orange-50",
    accent: "orange-100",
  },
};

const fonts = {
  sans: {
    name: "Inter",
    class: "font-sans",
  },
  serif: {
    name: "Playfair Display",
    class: "font-serif",
  },
  mono: {
    name: "JetBrains Mono",
    class: "font-mono",
  },
};

export function ThemeProvider({ children }) {
  const [colorTheme, setColorTheme] = useState("blue");
  const [fontTheme, setFontTheme] = useState("sans");

  useEffect(() => {
    const savedColorTheme = localStorage.getItem("colorTheme");
    const savedFontTheme = localStorage.getItem("fontTheme");

    if (savedColorTheme && themes[savedColorTheme]) {
      setColorTheme(savedColorTheme);
    }

    if (savedFontTheme && fonts[savedFontTheme]) {
      setFontTheme(savedFontTheme);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("colorTheme", colorTheme);
    document.documentElement.className = fonts[fontTheme].class;
  }, [colorTheme, fontTheme]);

  useEffect(() => {
    localStorage.setItem("fontTheme", fontTheme);
    document.documentElement.className = fonts[fontTheme].class;
  }, [fontTheme]);

  const updateColorTheme = (theme) => {
    if (themes[theme]) {
      setColorTheme(theme);
    }
  };

  const updateFontTheme = (font) => {
    if (fonts[font]) {
      setFontTheme(font);
    }
  };

  const value = {
    colorTheme,
    fontTheme,
    themes,
    fonts,
    updateColorTheme,
    updateFontTheme,
    currentTheme: themes[colorTheme],
    currentFont: fonts[fontTheme],
  };

  return (
    <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
  );
}

// eslint-disable-next-line react-refresh/only-export-components
export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
}
