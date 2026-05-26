import { defaultTheme, type ThemeTokens } from "@/shared";
import { defineStore } from "pinia";

const storageKey = "source-shop-mobile-theme";

export const useThemeStore = defineStore("theme", {
  state: () => ({
    tokens: { ...defaultTheme, brandName: "源码与技术服务平台" } as ThemeTokens
  }),
  getters: {
    cssVars: (state) => ({
      "--theme-primary": state.tokens.primaryColor,
      "--theme-success": state.tokens.successColor,
      "--theme-warning": state.tokens.warningColor,
      "--theme-error": state.tokens.errorColor,
      "--theme-page-bg": state.tokens.pageBg,
      "--theme-surface-bg": state.tokens.surfaceBg,
      "--theme-text": state.tokens.textColor,
      "--theme-muted": state.tokens.mutedTextColor,
      "--theme-border": state.tokens.borderColor,
      "--theme-radius": `${state.tokens.borderRadius}px`
    })
  },
  actions: {
    hydrate() {
      const saved = localStorage.getItem(storageKey);
      if (saved) this.tokens = { ...defaultTheme, brandName: "源码与技术服务平台", ...JSON.parse(saved) };
    },
    applyTheme() {
      this.hydrate();
      const root = document.documentElement;
      Object.entries(this.cssVars).forEach(([key, value]) => root.style.setProperty(key, String(value)));
    },
    updateTheme(partial: Partial<ThemeTokens>) {
      this.tokens = { ...this.tokens, ...partial };
      localStorage.setItem(storageKey, JSON.stringify(this.tokens));
      this.applyTheme();
    }
  }
});
