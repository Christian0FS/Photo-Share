/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: "class",
  content: [
    "./app/**/*.{js,jsx}",
    "./components/**/*.{js,jsx}",
  ],
  theme: {
    extend: {
      colors: {
        page: "var(--bg)",
        surface: "var(--surface)",
        border: "var(--border)",
        text: "var(--text)",
        muted: "var(--muted)",
        primary: "var(--primary)",
        accent: "var(--accent)",
        button: "var(--button)",
        buttonHover: "var(--button-hover)",
        coffee: {
          50: "#f7ede4",
          100: "#efd7ca",
          200: "#e4c2ad",
          300: "#d7a988",
          400: "#c78f60",
          500: "#a96937",
          600: "#8c5228",
          700: "#6f3f1e",
          800: "#543114",
          900: "#3a220d",
        },
      },
      boxShadow: {
        soft: "0 10px 30px rgba(0, 0, 0, 0.08)",
      },
    },
  },
  plugins: [],
};
