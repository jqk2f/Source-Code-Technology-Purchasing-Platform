/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./index.html", "./src/**/*.{vue,ts}"],
  theme: {
    extend: {
      colors: {
        brand: "var(--theme-primary)",
        page: "var(--theme-page-bg)",
        surface: "var(--theme-surface-bg)"
      },
      borderRadius: {
        theme: "calc(var(--theme-radius) * 1px)"
      }
    }
  },
  corePlugins: {
    preflight: false
  }
};
