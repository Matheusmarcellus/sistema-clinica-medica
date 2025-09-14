<template>
  <div class="historico-container">
    <!-- Navbar -->
    <nav class="navbar">
      <div class="nav-brand">
        <h2>📋 Meus Agendamentos</h2>
      </div>
      <div class="nav-items">
        <button @click="voltarParaDashboard" class="btn-voltar">
          ← Voltar
        </button>
      </div>
    </nav>

    <!-- Conteúdo Principal -->
    <div class="historico-content">
      <div class="header-section">
        <h1>Minhas Consultas</h1>
        <p>Gerencie e visualize suas consultas agendadas</p>
      </div>

      <!-- Filtros -->
      <div class="filtros-section">
        <div class="filtro-group">
          <label for="status" class="filtro-label">Filtrar por status:</label>
          <select v-model="filtroStatus" id="status" class="filtro-select">
            <option value="todos">Todos</option>
            <option value="agendado">Agendados</option>
            <option value="realizado">Realizados</option>
            <option value="cancelado">Cancelados</option>
          </select>
        </div>
      </div>

      <!-- Lista de Agendamentos -->
      <div class="agendamentos-list">
        <!-- Loading -->
        <div v-if="carregando" class="loading">
          <p>Carregando agendamentos...</p>
        </div>

        <!-- Lista Vazia -->
        <div v-else-if="agendamentosFiltrados.length === 0" class="empty-state">
          <div class="empty-icon">📅</div>
          <h3>Nenhuma consulta agendada</h3>
          <p>Que tal agendar sua primeira consulta?</p>
          <button @click="irParaAgendamento" class="btn-primary">
            Agendar Consulta
          </button>
        </div>

        <!-- Agendamentos -->
        <div v-else class="agendamentos-grid">
          <div
            v-for="agendamento in agendamentosFiltrados"
            :key="agendamento.id"
            class="agendamento-card"
            :class="agendamento.status"
          >
            <div class="agendamento-header">
              <h3>Consulta {{ formatarData(agendamento.data) }}</h3>
              <span class="status-badge" :class="agendamento.status">
                {{ formatarStatus(agendamento.status) }}
              </span>
            </div>

            <div class="agendamento-details">
              <div class="detail-item">
                <span class="detail-label">⏰ Horário:</span>
                <span class="detail-value">{{ agendamento.hora }}</span>
              </div>

              <div class="detail-item">
                <span class="detail-label">🏥 Local:</span>
                <span class="detail-value"
                  >{{ agendamento.endereco.rua }},
                  {{ agendamento.endereco.cidade }}</span
                >
              </div>

              <div v-if="agendamento.sintomas" class="detail-item">
                <span class="detail-label">📝 Sintomas:</span>
                <span class="detail-value">{{ agendamento.sintomas }}</span>
              </div>

              <div v-if="agendamento.clima" class="detail-item">
                <span class="detail-label">⛅ Clima:</span>
                <span class="detail-value">{{ agendamento.clima }}</span>
              </div>

              <div class="detail-item">
                <span class="detail-label">📅 Criado em:</span>
                <span class="detail-value">{{
                  formatarDataHora(agendamento.createdAt)
                }}</span>
              </div>
            </div>

            <div class="agendamento-actions">
              <button
                v-if="agendamento.status === 'agendado'"
                @click="cancelarAgendamento(agendamento.id)"
                class="btn-cancelar"
              >
                Cancelar
              </button>

              <button
                v-if="agendamento.status === 'agendado'"
                @click="editarAgendamento(agendamento.id)"
                class="btn-editar"
              >
                Editar
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "Historico",
  data() {
    return {
      filtroStatus: "todos",
      carregando: false,
    };
  },
  computed: {
    agendamentos() {
      return this.$store.getters.meusAgendamentos;
    },
    agendamentosFiltrados() {
      if (this.filtroStatus === "todos") {
        return this.agendamentos;
      }
      return this.agendamentos.filter((a) => a.status === this.filtroStatus);
    },
  },
  methods: {
    formatarData(data) {
      return new Date(data).toLocaleDateString("pt-BR");
    },
    formatarDataHora(dataISO) {
      if (!dataISO) return "Data não disponível";
      return new Date(dataISO).toLocaleString("pt-BR");
    },
    formatarStatus(status) {
      const statusMap = {
        agendado: "Agendado",
        realizado: "Realizado",
        cancelado: "Cancelado",
      };
      return statusMap[status] || status;
    },
    cancelarAgendamento(id) {
      if (confirm("Tem certeza que deseja cancelar esta consulta?")) {
        this.$store.dispatch("cancelarAgendamento", id);
        alert("Consulta cancelada com sucesso!");
      }
    },
    editarAgendamento(id) {
      alert(`Em breve: Editar agendamento ${id}`);
    },
    irParaAgendamento() {
      this.$router.push("/agendamento");
    },
    voltarParaDashboard() {
      this.$router.push("/dashboard");
    },
  },
  mounted() {
    // Simula carregamento de dados
    this.carregando = true;
    setTimeout(() => {
      this.carregando = false;
    }, 500);
  },
};
</script>

<style scoped>
.historico-container {
  min-height: 100vh;
  background: #f5f7fa;
}

.historico-content {
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
}

.header-section {
  text-align: center;
  margin-bottom: 2rem;
}

.header-section h1 {
  color: #2d3748;
  margin-bottom: 0.5rem;
}

.header-section p {
  color: #718096;
}

.filtros-section {
  background: white;
  padding: 1.5rem;
  border-radius: 12px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  margin-bottom: 2rem;
}

.filtro-group {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.filtro-label {
  font-weight: 600;
  color: #2d3748;
}

.filtro-select {
  padding: 8px 12px;
  border: 2px solid #e2e8f0;
  border-radius: 6px;
  background: white;
}

.agendamentos-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));
  gap: 1.5rem;
}

.agendamento-card {
  background: white;
  padding: 1.5rem;
  border-radius: 12px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
  border-left: 4px solid #667eea;
}

.agendamento-card.agendado {
  border-left-color: #48bb78;
}

.agendamento-card.realizado {
  border-left-color: #4299e1;
}

.agendamento-card.cancelado {
  border-left-color: #f56565;
}

.agendamento-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
}

.agendamento-header h3 {
  color: #2d3748;
  margin: 0;
}

.status-badge {
  padding: 4px 12px;
  border-radius: 20px;
  font-size: 0.8rem;
  font-weight: 600;
}

.status-badge.agendado {
  background: #c6f6d5;
  color: #2f855a;
}

.status-badge.realizado {
  background: #bee3f8;
  color: #2c5282;
}

.status-badge.cancelado {
  background: #fed7d7;
  color: #c53030;
}

.agendamento-details {
  margin-bottom: 1rem;
}

.detail-item {
  display: flex;
  justify-content: space-between;
  margin-bottom: 0.5rem;
  padding: 0.5rem 0;
  border-bottom: 1px solid #e2e8f0;
}

.detail-item:last-child {
  border-bottom: none;
}

.detail-label {
  font-weight: 600;
  color: #4a5568;
}

.detail-value {
  color: #718096;
  text-align: right;
  max-width: 200px;
  word-wrap: break-word;
}

.agendamento-actions {
  display: flex;
  gap: 0.5rem;
}

.btn-cancelar {
  background: #f56565;
  color: white;
  padding: 8px 16px;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-weight: 600;
}

.btn-cancelar:hover {
  background: #e53e3e;
}

.btn-editar {
  background: #ed8936;
  color: white;
  padding: 8px 16px;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-weight: 600;
}

.btn-editar:hover {
  background: #dd6b20;
}

.empty-state {
  text-align: center;
  padding: 3rem;
  background: white;
  border-radius: 12px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
}

.empty-icon {
  font-size: 4rem;
  margin-bottom: 1rem;
}

.loading {
  text-align: center;
  padding: 2rem;
  color: #718096;
}

@media (max-width: 768px) {
  .agendamentos-grid {
    grid-template-columns: 1fr;
  }

  .filtro-group {
    flex-direction: column;
    align-items: flex-start;
  }

  .agendamento-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 0.5rem;
  }

  .detail-item {
    flex-direction: column;
    gap: 0.25rem;
  }

  .detail-value {
    text-align: left;
    max-width: none;
  }

  .agendamento-actions {
    flex-direction: column;
  }
}
</style>
