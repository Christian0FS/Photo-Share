"use client";

import { useState } from "react";

export default function PhotoCard({ photo, isLoggedIn }) {
  const [liked, setLiked] = useState(photo.likedByMe);
  const [likeCount, setLikeCount] = useState(photo.likeCount);
  const [loading, setLoading] = useState(false);

  async function handleLike() {
    if (!isLoggedIn || loading) return;
    setLoading(true);

    setLiked((prev) => !prev);
    setLikeCount((prev) => (liked ? prev - 1 : prev + 1));

    try {
      const res = await fetch(`/api/photos/${photo.id}/like`, {
        method: "POST",
      });
      const data = await res.json();
      if (res.ok) {
        setLiked(data.liked);
        setLikeCount(data.likeCount);
      }
    } catch {
      setLiked((prev) => !prev);
      setLikeCount((prev) => (liked ? prev + 1 : prev - 1));
    } finally {
      setLoading(false);
    }
  }

  return (
    <article className="mb-6 overflow-hidden rounded-3xl border border-border bg-surface shadow-soft">
      <div className="flex items-center gap-3 px-4 py-4">
        {photo.author.avatarUrl ? (
          <img
            src={photo.author.avatarUrl}
            alt={photo.author.name}
            className="h-10 w-10 rounded-full object-cover"
          />
        ) : (
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-coffee-200 text-coffee-900 font-semibold text-sm">
            {photo.author.name.charAt(0).toUpperCase()}
          </div>
        )}
        <span className="font-medium text-sm text-text">{photo.author.name}</span>
      </div>

      <img
        src={photo.url}
        alt={photo.description || "Foto publicada"}
        className="w-full bg-page object-cover"
      />

      <div className="space-y-3 px-4 py-4">
        <button
          onClick={handleLike}
          disabled={!isLoggedIn}
          className={`flex items-center gap-2 text-2xl transition-transform active:scale-95 ${
            !isLoggedIn ? "cursor-not-allowed opacity-50" : ""
          }`}
          title={isLoggedIn ? "Curtir" : "Entre para curtir"}
        >
          <span>{liked ? "❤️" : "🤍"}</span>
          <span className="text-sm font-medium text-text">{liked ? "Curtido" : "Curtir"}</span>
        </button>

        <p className="text-sm font-semibold text-text">
          {likeCount} {likeCount === 1 ? "curtida" : "curtidas"}
        </p>

        {photo.description && (
          <p className="text-sm text-text/90">
            <span className="font-semibold text-text">{photo.author.name}:</span>
            <span className="ml-1">{photo.description}</span>
          </p>
        )}
      </div>
    </article>
  );
}
