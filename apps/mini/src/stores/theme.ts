import { defaultTheme, type ThemeTokens } from "@source-shop/shared";
import { defineStore } from "pinia";

const storageKey = "source-shop-mobile-theme";

export const useThemeStore = defineStore("theme", {
  state: () => ({
    tokens: { ...defaultTheme } as ThemeTokens
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
      const saved = uni.getStorageSync(storageKey);
      if (saved) this.tokens = { ...defaultTheme, ...JSON.parse(saved) };
    },
    updateTheme(partial: Partial<ThemeTokens>) {
      this.tokens = { ...this.tokens, ...partial };
      uni.setStorageSync(storageKey, JSON.stringify(this.tokens));
    }
  }
});
