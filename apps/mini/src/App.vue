<script setup lang="ts">
import { onLaunch } from "@dcloudio/uni-app";
import { useThemeStore } from "./stores/theme";

onLaunch(() => {
  useThemeStore().hydrate();
});
</script>

<style>
@import "./styles/theme.css";

page {
  min-height: 100%;
  background: var(--theme-page-bg);
  color: var(--theme-text);
  font-family: -apple-system, BlinkMacSystemFont, "PingFang SC", "Microsoft YaHei", sans-serif;
}
</style>
