import { defineConfig } from "vite";
import uniPlugin from "@dcloudio/vite-plugin-uni";

const uniModule = uniPlugin as unknown as { default?: unknown };
const uni =
  typeof uniPlugin === "function"
    ? uniPlugin
    : typeof uniModule.default === "function"
      ? uniModule.default
      : (uniModule.default as { default: () => unknown }).default;

export default defineConfig({
  plugins: [uni()],
  server: {
    host: "0.0.0.0",
    port: 5174
  }
});
