"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function UploadPage() {
  const [checking, setChecking] = useState(true);
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [description, setDescription] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  useEffect(() => {
    fetch("/api/me")
      .then((res) => res.json())
      .then((data) => {
        if (!data.user) {
          router.push("/login");
        } else {
          setChecking(false);
        }
      });
  }, [router]);

  function handleFileChange(e) {
    const selected = e.target.files?.[0];
    if (!selected) return;
    setFile(selected);
    setPreview(URL.createObjectURL(selected));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (!file) {
      setError("Escolha uma foto para publicar.");
      return;
    }
    setError("");
    setLoading(true);

    const formData = new FormData();
    formData.append("photo", file);
    formData.append("description", description);

    const res = await fetch("/api/photos", {
      method: "POST",
      body: formData,
    });
    const data = await res.json();

    setLoading(false);

    if (!res.ok) {
      setError(data.error || "Erro ao publicar foto.");
      return;
    }

    router.push("/");
    router.refresh();
  }

  if (checking) return null;

  return (
    <div className="max-w-sm mx-auto mt-6 overflow-hidden rounded-3xl border border-border bg-surface p-6 shadow-soft">
      <h1 className="text-2xl font-semibold mb-5 text-center">Publicar foto</h1>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="mb-2 block text-sm font-medium text-text">Foto</label>
          <label className="block rounded-3xl border-2 border-dashed border-border bg-page p-4 text-center text-sm text-muted transition hover:border-accent hover:text-text">
            {preview ? (
              <img src={preview} alt="Pré-visualização" className="mx-auto max-h-72 w-full object-cover" />
            ) : (
              <div className="flex h-40 items-center justify-center text-muted">
                Clique para escolher uma foto
              </div>
            )}
            <input
              type="file"
              accept="image/png, image/jpeg, image/webp, image/gif"
              onChange={handleFileChange}
              className="hidden"
            />
          </label>
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium text-text">Descrição</label>
          <textarea
            placeholder="Escreva uma descrição..."
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={4}
            className="w-full rounded-3xl border border-border bg-page px-4 py-3 text-sm text-text outline-none transition focus:border-accent focus:ring-2 focus:ring-accent/20"
          />
        </div>

        {error && <p className="mt-2 text-red-500 text-sm">{error}</p>}

        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-3xl bg-button px-4 py-3 text-sm font-medium text-white transition hover:bg-button-hover disabled:opacity-70"
        >
          {loading ? "Publicando..." : "Publicar"}
        </button>
      </form>
    </div>
  );
}
