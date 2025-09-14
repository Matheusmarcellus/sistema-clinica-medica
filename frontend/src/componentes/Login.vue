<template>
  <div class="login-page">
    <div class="login-card">
      <div class="logo">🏥</div>
      <h2>Acessar Sistema</h2>
      <p class="subtitle">Entre com suas credenciais</p>

      <form @submit.prevent="fazerLogin">
        <div class="input-field">
          <input
            v-model="credenciais.email"
            type="email"
            placeholder=" "
            required
          />
          <label>Email</label>
        </div>

        <div class="input-field">
          <input
            v-model="credenciais.senha"
            type="password"
            placeholder=" "
            required
          />
          <label>Senha</label>
        </div>

        <button type="submit" class="login-btn" :disabled="carregando">
          {{ carregando ? "Entrando..." : "Entrar" }}
        </button>
      </form>

      <p class="register-link">
        Não tem conta? <a @click="irParaCadastro">Cadastre-se</a>
      </p>

      <div v-if="erro" class="error-msg">⚠️ {{ erro }}</div>
    </div>
  </div>
</template>

<script>
export default {
  name: "Login",
  data() {
    return {
      credenciais: { email: "", senha: "" },
      carregando: false,
      erro: "",
    };
  },
  methods: {
    async fazerLogin() {
      this.carregando = true;
      this.erro = "";
      try {
        await this.$store.dispatch("login", this.credenciais);
        this.$router.push("/dashboard");
      } catch (erro) {
        this.erro = erro.response?.data?.erro || "Erro ao fazer login.";
      } finally {
        this.carregando = false;
      }
    },
    irParaCadastro() {
      this.$router.push("/cadastro");
    },
  },
};
</script>

<style scoped>
.login-page {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding: 20px;
}

.login-card {
  background: white;
  padding: 40px 30px;
  border-radius: 16px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.15);
  width: 100%;
  max-width: 400px;
  text-align: center;
}

.logo {
  font-size: 50px;
  margin-bottom: 15px;
}

h2 {
  color: #2d3748;
  margin-bottom: 5px;
  font-size: 24px;
}

.subtitle {
  color: #718096;
  margin-bottom: 30px;
}

.input-field {
  position: relative;
  margin-bottom: 20px;
}

.input-field input {
  width: 100%;
  padding: 16px;
  border: 2px solid #e2e8f0;
  border-radius: 10px;
  font-size: 16px;
  background: transparent;
  transition: all 0.3s ease;
}

.input-field input:focus {
  border-color: #667eea;
  outline: none;
}

.input-field label {
  position: absolute;
  left: 16px;
  top: 16px;
  color: #a0aec0;
  transition: all 0.3s ease;
  pointer-events: none;
}

.input-field input:focus + label,
.input-field input:not(:placeholder-shown) + label {
  top: -10px;
  left: 12px;
  font-size: 12px;
  background: white;
  padding: 0 8px;
  color: #667eea;
}

.login-btn {
  width: 100%;
  padding: 16px;
  background: #667eea;
  color: white;
  border: none;
  border-radius: 10px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  margin-top: 10px;
}

.login-btn:hover:not(:disabled) {
  background: #5a67d8;
  transform: translateY(-1px);
}

.login-btn:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}

.register-link {
  margin-top: 25px;
  color: #718096;
}

.register-link a {
  color: #667eea;
  text-decoration: none;
  font-weight: 600;
  cursor: pointer;
}

.register-link a:hover {
  text-decoration: underline;
}

.error-msg {
  margin-top: 20px;
  padding: 12px;
  background: #fed7d7;
  color: #c53030;
  border-radius: 8px;
  border-left: 4px solid #c53030;
}
</style>
