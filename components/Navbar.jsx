"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function Navbar() {
  const [user, setUser] = useState(undefined);
  const [theme, setTheme] = useState("light");
  const [isToggling, setIsToggling] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const saved = localStorage.getItem("theme");
    const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    const initialTheme = saved || (prefersDark ? "dark" : "light");
    setTheme(initialTheme);
  }, []);

  useEffect(() => {
    const root = document.documentElement;
    if (theme === "dark") {
      root.classList.add("dark");
    } else {
      root.classList.remove("dark");
    }
    localStorage.setItem("theme", theme);
    window.dispatchEvent(new StorageEvent("storage", {
      key: "theme",
      newValue: theme,
    }));
  }, [theme]);

  useEffect(() => {
    if (!isToggling) return;
    const timer = setTimeout(() => setIsToggling(false), 300);
    return () => clearTimeout(timer);
  }, [isToggling]);

  useEffect(() => {
    fetch("/api/me")
      .then((res) => res.json())
      .then((data) => setUser(data.user))
      .catch(() => setUser(null));
  }, []);

  async function handleLogout() {
    await fetch("/api/logout", { method: "POST" });
    setUser(null);
    router.push("/login");
    router.refresh();
  }

  function toggleTheme() {
    setIsToggling(true);
    setTheme((current) => (current === "dark" ? "light" : "dark"));
  }

  return (
    <>
      <header className="sticky top-0 z-10 border-b border-border bg-surface shadow-soft">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
          <Link href="/" className="text-xl font-semibold text-primary">
            PhotoShare
          </Link>

          <div className="flex items-center gap-3">
            <nav className="flex flex-wrap items-center gap-3 text-sm">
              {user === undefined ? null : user ? (
                <>
                  <Link href="/upload" className="rounded-full border border-border bg-page px-3 py-1.5 font-medium text-text transition hover:bg-surface">
                    Publicar
                  </Link>
                  <Link href="/profile" className="flex items-center gap-2 rounded-full border border-border bg-page px-3 py-1.5 text-text transition hover:bg-surface">
                    {user.avatarUrl ? (
                      <img
                        src={user.avatarUrl}
                        alt={user.name}
                        className="h-8 w-8 rounded-full object-cover"
                      />
                    ) : (
                      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-coffee-200 text-coffee-900 font-semibold">
                        {user.name.charAt(0).toUpperCase()}
                      </div>
                    )}
                    <span className="hidden sm:inline text-muted">Olá, {user.name}</span>
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="rounded-full border border-border bg-page px-3 py-1.5 text-text transition hover:bg-surface"
                  >
                    Sair
                  </button>
                </>
              ) : (
                <>
                  <Link href="/login" className="rounded-full border border-border bg-page px-3 py-1.5 text-text transition hover:bg-surface">
                    Entrar
                  </Link>
                  <Link
                    href="/register"
                    className="rounded-full bg-button px-3 py-1.5 text-white transition hover:bg-button-hover"
                  >
                    Criar conta
                  </Link>
                </>
              )}
            </nav>
          </div>
        </div>
      </header>

      <button
        type="button"
        onClick={toggleTheme}
        className="fixed right-5 top-2 z-50 flex h-11 w-11 items-center justify-center text-text transition-transform duration-300 ease-out hover:scale-110 focus:outline-none focus:ring-2 focus:ring-accent/60"
        aria-label="Alternar tema"
      >
        <span className={`text-2xl transition-transform duration-300 ease-out ${isToggling ? "rotate-[360deg] scale-110" : ""}`}>
          {theme === "dark" ? "🌙" : "☀️"}
        </span>
      </button>
    </>
  );
}
