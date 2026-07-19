"use client";

import { Moon, Sun } from "lucide-react";
import { useEffect, useState } from "react";

const storageKey = "restaurant-theme";

function getCurrentTheme() {
  return document.documentElement.dataset.theme === "dark" ? "dark" : "light";
}

export default function ThemeToggle() {
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    setIsDark(getCurrentTheme() === "dark");
  }, []);

  return (
    <button
      className="theme-toggle"
      type="button"
      aria-label={isDark ? "Switch to light theme" : "Switch to dark theme"}
      onClick={() => {
        const next = isDark ? "light" : "dark";
        document.documentElement.dataset.theme = next;
        localStorage.setItem(storageKey, next);
        setIsDark(next === "dark");
      }}
    >
      <Sun className="theme-icon theme-sun" size={18} />
      <Moon className="theme-icon theme-moon" size={18} />
      <span className="theme-toggle-text">Theme</span>
    </button>
  );
}
