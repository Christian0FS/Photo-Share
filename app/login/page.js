"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function LoginPage() {
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  useEffect(() => {
    fetch("/api/me")
      .then((res) => res.json())
      .then((data) => {
        if (data.user) {
          router.push("/");
        }
      });
  }, [router]);

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setLoading(true);

    const res = await fetch("/api/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, password }),
    });
    const data = await res.json();

    setLoading(false);

    if (!res.ok) {
      setError(data.error || "Erro ao entrar.");
      return;
    }

    router.push("/");
    router.refresh();
  }

  return (
    <div className="max-w-sm mx-auto mt-10 bg-surface border border-border rounded-3xl p-6 shadow-soft">
      <h1 className="text-2xl font-bold mb-5 text-center">Entrar</h1>

      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          placeholder="Nome"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          className="w-full border border-border rounded-2xl px-4 py-3 text-sm bg-page text-text outline-none focus:border-accent focus:ring-2 focus:ring-accent/20"
        />
        <input
          type="password"
          placeholder="Senha"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          className="w-full border border-border rounded-2xl px-4 py-3 text-sm bg-page text-text outline-none focus:border-accent focus:ring-2 focus:ring-accent/20"
        />

        {error && <p className="mt-2 text-red-500 text-sm">{error}</p>}

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-button text-white rounded-2xl py-3 text-sm font-medium hover:bg-button-hover disabled:opacity-70 transition"
        >
          {loading ? "Entrando..." : "Entrar"}
        </button>
      </form>

      <p className="text-sm text-center mt-5 text-muted">
        Não tem conta?{" "}
        <Link href="/register" className="text-accent font-medium hover:underline">
          Cadastre-se
        </Link>
      </p>
    </div>
  );
}
