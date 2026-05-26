import "ant-design-vue/dist/reset.css";
import "./styles/tailwind.css";
import "./styles/theme.css";

import Antd from "ant-design-vue";
import { createPinia } from "pinia";
import { createApp } from "vue";
import App from "./App.vue";
import { router } from "./router";
import { useThemeStore } from "./stores/theme";

const app = createApp(App);
const pinia = createPinia();

app.use(pinia);
app.use(router);
app.use(Antd);

useThemeStore().applyTheme();

app.mount("#app");
