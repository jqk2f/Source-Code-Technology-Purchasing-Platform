import { defineConfig } from "vite";
import { fileURLToPath, URL } from "node:url";
import { loadEnv } from "vite";
import vue from "@vitejs/plugin-vue";

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "");
  return {
    plugins: [vue()],
    resolve: {
      alias: {
        "@": fileURLToPath(new URL("./src", import.meta.url))
      }
    },
    server: {
      host: "0.0.0.0",
      port: 5174,
      proxy: {
        "/api": {
          target: env.VITE_API_PROXY || "http://127.0.0.1:7001",
          changeOrigin: true
        }
      }
    }
  };
});
