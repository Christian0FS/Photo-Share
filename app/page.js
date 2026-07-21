import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";
import PhotoCard from "@/components/PhotoCard";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const currentUser = await getCurrentUser();

  const photos = await prisma.photo.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      author: { select: { id: true, name: true, avatarUrl: true } },
      likes: { select: { userId: true } },
    },
  });

  const feed = photos.map((photo) => ({
    id: photo.id,
    url: photo.url,
    description: photo.description,
    author: photo.author,
    likeCount: photo.likes.length,
    likedByMe: currentUser
      ? photo.likes.some((l) => l.userId === currentUser.id)
      : false,
  }));

  return (
    <div>
      <div className="mb-8 overflow-hidden rounded-3xl border border-border bg-surface p-6 shadow-soft">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-xs uppercase tracking-[0.3em] text-muted">Nova foto</p>
            <h2 className="mt-3 text-2xl font-semibold text-text">Poste sua foto com descrição</h2>
            <p className="mt-2 max-w-2xl text-sm text-muted">
              Adicione sua imagem e conte a história por trás dela. Tudo pronto para publicar?
            </p>
          </div>
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
            <a
              href="/upload"
              className="inline-flex items-center justify-center rounded-full bg-button px-5 py-3 text-sm font-medium text-white transition hover:bg-button-hover"
            >
              Postar foto
            </a>
            {!currentUser && (
              <a
                href="/login"
                className="inline-flex items-center justify-center rounded-full border border-border bg-page px-5 py-3 text-sm text-text transition hover:bg-surface"
              >
                Entrar para postar
              </a>
            )}
          </div>
        </div>
      </div>

      {feed.length === 0 ? (
        <div className="text-center py-20 text-muted">
          <p className="text-lg font-medium mb-1">Nenhuma foto ainda</p>
          <p className="text-sm">Seja o primeiro a publicar uma foto!</p>
        </div>
      ) : (
        feed.map((photo) => (
          <PhotoCard key={photo.id} photo={photo} isLoggedIn={!!currentUser} />
        ))
      )}
    </div>
  );
}
