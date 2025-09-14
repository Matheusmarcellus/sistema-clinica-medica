import { createStore } from "vuex";
import axios from "axios";

export default createStore({
  state: {
    usuario: JSON.parse(localStorage.getItem("usuario")) || null,
    token: localStorage.getItem("token") || null,
    carregando: false,
    agendamentos: JSON.parse(localStorage.getItem("agendamentos")) || [],
  },

  mutations: {
    SET_USUARIO(state, usuario) {
      state.usuario = usuario;
      localStorage.setItem("usuario", JSON.stringify(usuario));
    },

    SET_TOKEN(state, token) {
      state.token = token;
      localStorage.setItem("token", token);
    },

    SET_CARREGANDO(state, carregando) {
      state.carregando = carregando;
    },

    LOGOUT(state) {
      state.usuario = null;
      state.token = null;
      state.agendamentos = [];
      localStorage.removeItem("usuario");
      localStorage.removeItem("token");
      localStorage.removeItem("agendamentos");
    },

    ADD_AGENDAMENTO(state, agendamento) {
      const novoAgendamento = {
        ...agendamento,
        id: Date.now(),
        createdAt: new Date().toISOString(),
        status: "agendado",
      };

      state.agendamentos.push(novoAgendamento);
      localStorage.setItem("agendamentos", JSON.stringify(state.agendamentos));
    },

    UPDATE_AGENDAMENTO(state, { id, updates }) {
      const index = state.agendamentos.findIndex((a) => a.id === id);
      if (index !== -1) {
        state.agendamentos[index] = {
          ...state.agendamentos[index],
          ...updates,
        };
        localStorage.setItem(
          "agendamentos",
          JSON.stringify(state.agendamentos)
        );
      }
    },
  },

  actions: {
    async login({ commit }, credenciais) {
      commit("SET_CARREGANDO", true);
      try {
        const response = await axios.post(
          "http://localhost:5000/api/autenticacao/login",
          credenciais
        );

        commit("SET_TOKEN", response.data.token);
        commit("SET_USUARIO", response.data.usuario);

        window.location.href = "/dashboard";

        return response;
      } catch (error) {
        console.error("Erro no login:", error);
        throw error;
      } finally {
        commit("SET_CARREGANDO", false);
      }
    },

    logout({ commit }) {
      commit("LOGOUT");
      window.location.href = "/";
    },

    adicionarAgendamento({ commit }, agendamento) {
      commit("ADD_AGENDAMENTO", agendamento);
    },

    cancelarAgendamento({ commit }, id) {
      commit("UPDATE_AGENDAMENTO", {
        id,
        updates: { status: "cancelado" },
      });
    },
  },

  getters: {
    estaLogado: (state) => !!state.token,
    usuarioAtual: (state) => state.usuario,
    estaCarregando: (state) => state.carregando,

    meusAgendamentos: (state) => {
      return state.agendamentos
        .filter((a) => a.pacienteId === state.usuario?.id || !a.pacienteId)
        .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    },

    agendamentosPorStatus: (state) => (status) => {
      const agendamentos = state.agendamentos.filter(
        (a) => a.pacienteId === state.usuario?.id || !a.pacienteId
      );

      if (status === "todos") return agendamentos;
      return agendamentos.filter((a) => a.status === status);
    },
  },
});
