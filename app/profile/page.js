"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function ProfilePage() {
    const [name, setName] = useState("");
    const [avatar, setAvatar] = useState(null);
    const [preview, setPreview] = useState(null);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const [loading, setLoading] = useState(false);
    const [user, setUser] = useState(null);
    const router = useRouter();

    useEffect(() => {
        fetch("/api/me")
            .then((res) => res.json())
            .then((data) => {
                if (!data.user) {
                    router.push("/login");
                    return;
                }
                setUser(data.user);
                setName(data.user.name || "");
                setPreview(data.user.avatarUrl || null);
            })
            .catch(() => router.push("/login"));
    }, [router]);

    function handleAvatarChange(e) {
        const selected = e.target.files?.[0];
        if (!selected) return;
        setAvatar(selected);
        setPreview(URL.createObjectURL(selected));
    }

    async function handleSubmit(e) {
        e.preventDefault();
        setError("");
        setSuccess("");
        setLoading(true);

        const formData = new FormData();
        formData.append("name", name);
        if (avatar) {
            formData.append("avatar", avatar);
        }

        const res = await fetch("/api/profile", {
            method: "POST",
            body: formData,
        });
        const data = await res.json();
        setLoading(false);

        if (!res.ok) {
            setError(data.error || "Erro ao atualizar perfil.");
            return;
        }

        setUser(data.user);
        window.location.reload();
    }

    if (!user) return null;

    return (
        <div className="mx-auto max-w-lg rounded-3xl border border-border bg-surface p-6 shadow-soft">
            <h1 className="text-2xl font-semibold mb-5">Meu perfil</h1>

            <form onSubmit={handleSubmit} className="space-y-5">
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                    <div className="flex h-24 w-24 items-center justify-center overflow-hidden rounded-3xl bg-page">
                        {preview ? (
                            <img src={preview} alt="Avatar" className="h-full w-full object-cover" />
                        ) : (
                            <span className="text-xl font-semibold text-coffee-900">{name.charAt(0).toUpperCase()}</span>
                        )}
                    </div>
                    <label className="rounded-full border border-border bg-page px-4 py-2 text-sm text-text transition hover:bg-surface">
                        Alterar foto
                        <input
                            type="file"
                            accept="image/png, image/jpeg, image/webp, image/gif"
                            onChange={handleAvatarChange}
                            className="hidden"
                        />
                    </label>
                </div>

                <div>
                    <label className="mb-2 block text-sm font-medium text-text">Nome</label>
                    <input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="w-full rounded-3xl border border-border bg-page px-4 py-3 text-sm text-text outline-none transition focus:border-accent focus:ring-2 focus:ring-accent/20"
                    />
                </div>

                {error && <p className="text-red-500 text-sm">{error}</p>}
                {success && <p className="text-emerald-500 text-sm">{success}</p>}

                <button
                    type="submit"
                    disabled={loading}
                    className="w-full rounded-3xl bg-button px-4 py-3 text-sm font-medium text-white transition hover:bg-button-hover disabled:opacity-70"
                >
                    {loading ? "Salvando..." : "Salvar alterações"}
                </button>
            </form>
        </div>
    );
}
