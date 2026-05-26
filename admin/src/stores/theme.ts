import { defaultTheme, type ThemeTokens } from "@/shared";
import { defineStore } from "pinia";

const storageKey = "source-shop-admin-theme";

export const useThemeStore = defineStore("theme", {
  state: () => ({
    tokens: { ...defaultTheme } as ThemeTokens
  }),
  actions: {
    hydrate() {
      const raw = localStorage.getItem(storageKey);
      if (raw) this.tokens = { ...defaultTheme, ...JSON.parse(raw) };
    },
    applyTheme() {
      this.hydrate();
      const root = document.documentElement;
      root.style.setProperty("--theme-primary", this.tokens.primaryColor);
      root.style.setProperty("--theme-page-bg", this.tokens.pageBg);
      root.style.setProperty("--theme-surface-bg", this.tokens.surfaceBg);
      root.style.setProperty("--theme-text", this.tokens.textColor);
      root.style.setProperty("--theme-muted", this.tokens.mutedTextColor);
      root.style.setProperty("--theme-border", this.tokens.borderColor);
      root.style.setProperty("--theme-radius", String(this.tokens.borderRadius));
    },
    updateTheme(partial: Partial<ThemeTokens>) {
      this.tokens = { ...this.tokens, ...partial };
      localStorage.setItem(storageKey, JSON.stringify(this.tokens));
      this.applyTheme();
    },
    resetTheme() {
      this.tokens = { ...defaultTheme };
      localStorage.removeItem(storageKey);
      this.applyTheme();
    }
  }
});
