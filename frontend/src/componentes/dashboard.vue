<template>
  <div class="dashboard-page">
    <header class="header">
      <div class="header-content">
        <div class="header-left">
          <h1>🏥 ClinicSys</h1>
        </div>
        <div class="header-right">
          <span>Olá, {{ usuario?.nome }}!</span>
          <button @click="sair" class="logout-btn">Sair</button>
        </div>
      </div>
    </header>

    <main class="main-content">
      <div class="welcome-section">
        <h2>Bem-vindo ao sistema!</h2>
        <p>Gerencie suas consultas de forma fácil</p>
      </div>

      <div class="actions-grid">
        <div class="action-card" @click="irParaAgendamentos">
          <div class="action-icon">📅</div>
          <h3>Agendar</h3>
          <p>Marcar nova consulta</p>
        </div>

        <div class="action-card" @click="irParaHistorico">
          <div class="action-icon">📋</div>
          <h3>Histórico</h3>
          <p>Ver suas consultas</p>
        </div>

        <div class="action-card" @click="irParaPerfil">
          <div class="action-icon">👤</div>
          <h3>Perfil</h3>
          <p>Seus dados</p>
        </div>
      </div>

      <div class="user-card">
        <h3>Seus Dados</h3>
        <div class="user-info">
          <div class="info-item">
            <span class="label">Nome:</span>
            <span class="value">{{ usuario?.nome }}</span>
          </div>
          <div class="info-item">
            <span class="label">Email:</span>
            <span class="value">{{ usuario?.email }}</span>
          </div>
          <div class="info-item">
            <span class="label">Tipo:</span>
            <span class="value">{{ usuario?.tipo }}</span>
          </div>
        </div>
      </div>
    </main>
  </div>
</template>

<script>
export default {
  name: "Dashboard",
  computed: {
    usuario() {
      return this.$store.state.usuario;
    },
  },
  methods: {
    sair() {
      this.$store.dispatch("logout");
    },
    irParaAgendamentos() {
      this.$router.push("/agendamento");
    },
    irParaHistorico() {
      this.$router.push("/historico");
    },
    irParaPerfil() {
      // Temporário - até arrumar o Perfil.vue
      alert("Perfil em desenvolvimento! 🚧");
    },
  },
  mounted() {
    if (!this.$store.getters.estaLogado) {
      this.$router.push("/");
    }
  },
};
</script>

<style scoped>
.dashboard-page {
  min-height: 100vh;
  background: #f7fafc;
}

.header {
  background: white;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  padding: 1rem 0;
}

.header-content {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 2rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.header-left h1 {
  color: #2d3748;
  font-size: 24px;
}

.header-right {
  display: flex;
  align-items: center;
  gap: 1rem;
  color: #4a5568;
}

.logout-btn {
  padding: 8px 16px;
  background: #e53e3e;
  color: white;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-weight: 500;
}

.logout-btn:hover {
  background: #c53030;
}

.main-content {
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
}

.welcome-section {
  text-align: center;
  margin-bottom: 3rem;
}

.welcome-section h2 {
  color: #2d3748;
  font-size: 28px;
  margin-bottom: 0.5rem;
}

.welcome-section p {
  color: #718096;
  font-size: 18px;
}

.actions-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 1.5rem;
  margin-bottom: 3rem;
}

.action-card {
  background: white;
  padding: 2rem;
  border-radius: 12px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  cursor: pointer;
  transition: all 0.3s ease;
  text-align: center;
}

.action-card:hover {
  transform: translateY(-3px);
  box-shadow: 0 8px 15px rgba(0, 0, 0, 0.15);
}

.action-icon {
  font-size: 40px;
  margin-bottom: 1rem;
}

.action-card h3 {
  color: #2d3748;
  margin-bottom: 0.5rem;
  font-size: 18px;
}

.action-card p {
  color: #718096;
}

.user-card {
  background: white;
  padding: 2rem;
  border-radius: 12px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.user-card h3 {
  color: #2d3748;
  margin-bottom: 1.5rem;
  text-align: center;
  font-size: 20px;
}

.user-info {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1rem;
}

.info-item {
  display: flex;
  justify-content: space-between;
  padding: 1rem;
  background: #f7fafc;
  border-radius: 8px;
}

.label {
  font-weight: 600;
  color: #4a5568;
}

.value {
  color: #718096;
}

@media (max-width: 768px) {
  .header-content {
    flex-direction: column;
    gap: 1rem;
    text-align: center;
  }

  .actions-grid {
    grid-template-columns: 1fr;
  }

  .user-info {
    grid-template-columns: 1fr;
  }

  .main-content {
    padding: 1rem;
  }
}
</style>
