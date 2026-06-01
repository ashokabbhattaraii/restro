"use client";

import { Moon, Sun } from "lucide-react";

const storageKey = "restaurant-theme";

function getNextTheme() {
  return document.documentElement.dataset.theme === "dark" ? "light" : "dark";
}

export default function ThemeToggle() {
  return (
    <button
      className="theme-toggle"
      type="button"
      aria-label="Toggle dark mode"
      onClick={() => {
        const theme = getNextTheme();
        document.documentElement.dataset.theme = theme;
        localStorage.setItem(storageKey, theme);
      }}
    >
      <Sun className="theme-icon theme-sun" size={18} />
      <Moon className="theme-icon theme-moon" size={18} />
      <span className="theme-toggle-text">Theme</span>
    </button>
  );
}
