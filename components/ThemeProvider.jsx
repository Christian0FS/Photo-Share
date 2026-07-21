"use client";

import { useEffect } from "react";

const THEME_KEY = "theme";

export default function ThemeProvider() {
  useEffect(() => {
    const root = document.documentElement;
    const savedTheme = localStorage.getItem(THEME_KEY);
    const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    const initialTheme = savedTheme || (prefersDark ? "dark" : "light");

    if (initialTheme === "dark") {
      root.classList.add("dark");
    } else {
      root.classList.remove("dark");
    }

    const handleStorage = (event) => {
      if (event.key !== THEME_KEY) return;
      if (event.newValue === "dark") {
        root.classList.add("dark");
      } else {
        root.classList.remove("dark");
      }
    };

    window.addEventListener("storage", handleStorage);
    return () => window.removeEventListener("storage", handleStorage);
  }, []);

  return null;
}
