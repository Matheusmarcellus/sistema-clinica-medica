import axios from "axios";

// Configuração base do axios
const api = axios.create({
  baseURL: "http://localhost:5000/api",
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

// Interceptor para adicionar o token automaticamente
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Interceptor para tratar erros globalmente
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("token");
      localStorage.removeItem("usuario");
      window.location.href = "/";
    }
    return Promise.reject(error);
  }
);

// Funções específicas da API
export const servicosAutenticacao = {
  login: (credenciais) => api.post("/autenticacao/login", credenciais),
  cadastro: (dadosUsuario) => api.post("/autenticacao/cadastro", dadosUsuario),
};

export const servicosAgendamentos = {
  criar: (dadosAgendamento) => api.post("/agendamentos", dadosAgendamento),
  listar: () => api.get("/agendamentos/meus-agendamentos"),
};

export default api;
