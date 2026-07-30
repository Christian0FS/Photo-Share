import "./globals.css";
import Navbar from "@/components/Navbar";
import ThemeProvider from "@/components/ThemeProvider";
import ClientPageTransition from "@/components/ClientPageTransition";

export const metadata = {
  title: "PhotoShare",
  description: "Compartilhe suas fotos, curta as fotos dos outros.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="pt-br">
      <body className="min-h-screen bg-page text-text transition-colors duration-200">
        <ThemeProvider />
        <Navbar />
        <main className="max-w-3xl mx-auto px-4 py-6 sm:px-6 lg:px-8">
          <ClientPageTransition>{children}</ClientPageTransition>
        </main>
      </body>
    </html>
  );
}