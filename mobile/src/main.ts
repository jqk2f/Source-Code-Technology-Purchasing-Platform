import { createApp } from "vue";
import { createPinia } from "pinia";
import Vant from "vant";
import "vant/lib/index.css";
import App from "./App.vue";
import { router } from "./router";
import { useThemeStore } from "./stores/theme";
import "./styles/theme.css";

const app = createApp(App);
const pinia = createPinia();

app.use(pinia);
app.use(router);
app.use(Vant);

useThemeStore().applyTheme();

app.mount("#app");
