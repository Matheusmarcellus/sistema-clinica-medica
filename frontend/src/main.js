import { createApp } from "vue";
import App from "./App.vue";
import roteador from "./roteador";
import armazenamento from "./armazenamento";

const app = createApp(App);
app.use(roteador);
app.use(armazenamento);
app.mount("#app");
