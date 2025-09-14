<template>
  <div class="cadastro-container">
    <div class="cadastro-card">
      <h2>📝 Criar Conta - Sistema Clínica</h2>

      <form @submit.prevent="fazerCadastro" class="cadastro-form">
        <div class="form-group">
          <label for="nome" class="form-label">Nome Completo:</label>
          <input
            v-model="dadosUsuario.nome"
            type="text"
            id="nome"
            class="form-input"
            placeholder="Seu nome completo"
            required
          />
        </div>

        <div class="form-group">
          <label for="email" class="form-label">Email:</label>
          <input
            v-model="dadosUsuario.email"
            type="email"
            id="email"
            class="form-input"
            placeholder="seu@email.com"
            required
          />
        </div>

        <div class="form-group">
          <label for="senha" class="form-label">Senha:</label>
          <input
            v-model="dadosUsuario.senha"
            type="password"
            id="senha"
            class="form-input"
            placeholder="Mínimo 6 caracteres"
            required
            minlength="6"
          />
        </div>

        <div class="form-group">
          <label for="tipo" class="form-label">Tipo de Usuário:</label>
          <select
            v-model="dadosUsuario.tipo"
            id="tipo"
            class="form-input"
            required
          >
            <option value="">Selecione o tipo</option>
            <option value="paciente">Paciente</option>
            <option value="secretario">Secretário</option>
          </select>
        </div>

        <div class="form-group">
          <label for="cep" class="form-label">CEP (Opcional):</label>
          <input
            v-model="dadosUsuario.cep"
            type="text"
            id="cep"
            class="form-input"
            placeholder="00000-000"
            @blur="buscarCep"
          />
        </div>

        <button type="submit" class="btn btn-primary" :disabled="carregando">
          {{ carregando ? "Criando conta..." : "Criar Conta" }}
        </button>
      </form>

      <p class="login-link">
        Já tem conta? <a href="#" @click="irParaLogin">Faça login aqui</a>
      </p>

      <div v-if="erro" class="error-message">❌ {{ erro }}</div>

      <div v-if="sucesso" class="success-message">✅ {{ sucesso }}</div>
    </div>
  </div>
</template>

<script>
import axios from "axios";

export default {
  name: "Cadastro",
  data() {
    return {
      dadosUsuario: {
        nome: "",
        email: "",
        senha: "",
        tipo: "",
        cep: "",
      },
      carregando: false,
      erro: "",
      sucesso: "",
    };
  },
  methods: {
    async fazerCadastro() {
      this.carregando = true;
      this.erro = "";
      this.sucesso = "";

      try {
        // 1. FAZ CADASTRO NO BACKEND
        await axios.post(
          "http://localhost:5000/api/autenticacao/cadastro",
          this.dadosUsuario
        );

        // 2. MOSTRA MENSAGEM DE SUCESSO
        this.sucesso =
          "Conta criada com sucesso! 🎉 Redirecionando para login...";

        // 3. REDIRECIONA PARA LOGIN APÓS 2 SEGUNDOS
        setTimeout(() => {
          this.irParaLogin();
        }, 2000);
      } catch (erro) {
        console.error("Erro no cadastro:", erro);
        this.erro =
          erro.response?.data?.erro || "Erro ao criar conta. Tente novamente.";
      } finally {
        this.carregando = false;
      }
    },

    async buscarCep() {
      if (this.dadosUsuario.cep && this.dadosUsuario.cep.length === 8) {
        try {
          console.log("Buscando CEP:", this.dadosUsuario.cep);
        } catch (erro) {
          console.error("Erro ao buscar CEP:", erro);
        }
      }
    },

    irParaLogin() {
      this.$router.push("/");
    },
  },
};
</script>

<style scoped>
.cadastro-container {
  min-height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding: 20px;
}

.cadastro-card {
  background: white;
  padding: 2rem;
  border-radius: 12px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
  width: 100%;
  max-width: 450px;
}

.cadastro-card h2 {
  text-align: center;
  margin-bottom: 1.5rem;
  color: #333;
  font-size: 1.5rem;
}

.cadastro-form {
  margin-bottom: 1.5rem;
}

.login-link {
  text-align: center;
  color: #666;
  margin-top: 1rem;
}

.login-link a {
  color: #667eea;
  text-decoration: none;
  font-weight: 600;
}

.login-link a:hover {
  text-decoration: underline;
}

.success-message {
  background: #c6f6d5;
  color: #2f855a;
  padding: 12px;
  border-radius: 8px;
  margin-top: 1rem;
  text-align: center;
}
</style>
