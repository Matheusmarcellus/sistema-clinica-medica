import { createRouter, createWebHistory } from "vue-router";
import Login from "../componentes/Login.vue";
import Cadastro from "../componentes/Cadastro.vue";
import Dashboard from "../componentes/dashboard.vue"; // ← minúsculo
import Agendamento from "../componentes/Agendamento.vue";
import Historico from "../componentes/Historico.vue";

const rotas = [
  {
    path: "/",
    name: "Login",
    component: Login,
  },
  {
    path: "/cadastro",
    name: "Cadastro",
    component: Cadastro,
  },
  {
    path: "/dashboard",
    name: "Dashboard",
    component: Dashboard,
    meta: { requerAuth: true },
  },
  {
    path: "/agendamento",
    name: "Agendamento",
    component: Agendamento,
    meta: { requerAuth: true },
  },
  {
    path: "/historico",
    name: "Historico",
    component: Historico,
    meta: { requerAuth: true },
  },
];

const roteador = createRouter({
  history: createWebHistory(),
  routes: rotas,
});

export default roteador;
