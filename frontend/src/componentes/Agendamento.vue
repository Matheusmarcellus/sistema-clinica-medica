<template>
  <div class="agendamento-container">
    <!-- Navbar -->
    <nav class="navbar">
      <div class="nav-brand">
        <h2>📅 Agendar Consulta</h2>
      </div>
      <div class="nav-items">
        <button @click="voltarParaDashboard" class="btn-voltar">
          ← Voltar
        </button>
      </div>
    </nav>

    <!-- Conteúdo Principal -->
    <div class="agendamento-content">
      <div class="welcome-section">
        <h1>Agende sua Consulta 🏥</h1>
        <p>Preencha os dados abaixo para agendar sua consulta</p>
      </div>

      <form @submit.prevent="agendarConsulta" class="agendamento-form">
        <!-- Data e Hora -->
        <div class="form-row">
          <div class="form-group">
            <label for="data" class="form-label">Data da Consulta:</label>
            <input
              v-model="agendamento.data"
              type="date"
              id="data"
              class="form-input"
              :min="dataMinima"
              required
            />
          </div>

          <div class="form-group">
            <label for="hora" class="form-label">Hora da Consulta:</label>
            <select
              v-model="agendamento.hora"
              id="hora"
              class="form-input"
              required
            >
              <option value="">Selecione o horário</option>
              <option
                v-for="hora in horariosDisponiveis"
                :key="hora"
                :value="hora"
              >
                {{ hora }}
              </option>
            </select>
          </div>
        </div>

        <!-- CEP e Endereço -->
        <div class="form-group">
          <label for="cep" class="form-label">CEP:</label>
          <input
            v-model="agendamento.cep"
            type="text"
            id="cep"
            class="form-input"
            placeholder="00000-000"
            @blur="buscarEndereco"
            required
          />
        </div>

        <div class="form-row">
          <div class="form-group">
            <label for="rua" class="form-label">Rua:</label>
            <input
              v-model="agendamento.rua"
              type="text"
              id="rua"
              class="form-input"
              placeholder="Nome da rua"
              readonly
            />
          </div>

          <div class="form-group">
            <label for="cidade" class="form-label">Cidade:</label>
            <input
              v-model="agendamento.cidade"
              type="text"
              id="cidade"
              class="form-input"
              placeholder="Cidade"
              readonly
            />
          </div>
        </div>

        <!-- Sintomas -->
        <div class="form-group">
          <label for="sintomas" class="form-label">Sintomas (Opcional):</label>
          <textarea
            v-model="agendamento.sintomas"
            id="sintomas"
            class="form-input"
            placeholder="Descreva seus sintomas..."
            rows="3"
          ></textarea>
        </div>

        <!-- Previsão do Tempo -->
        <div v-if="previsaoTempo" class="weather-info">
          <h3>⛅ Previsão do Tempo</h3>
          <p>{{ previsaoTempo }}</p>
        </div>

        <button type="submit" class="btn btn-primary" :disabled="carregando">
          {{ carregando ? "Agendando..." : "Agendar Consulta" }}
        </button>
      </form>

      <div v-if="erro" class="error-message">❌ {{ erro }}</div>

      <div v-if="sucesso" class="success-message">✅ {{ sucesso }}</div>
    </div>
  </div>
</template>

<script>
import axios from "axios";

export default {
  name: "Agendamento",
  data() {
    return {
      agendamento: {
        data: "",
        hora: "",
        cep: "",
        rua: "",
        cidade: "",
        sintomas: "",
      },
      previsaoTempo: "",
      carregando: false,
      erro: "",
      sucesso: "",
    };
  },
  computed: {
    dataMinima() {
      const hoje = new Date();
      return hoje.toISOString().split("T")[0];
    },
    horariosDisponiveis() {
      return [
        "08:00",
        "09:00",
        "10:00",
        "11:00",
        "14:00",
        "15:00",
        "16:00",
        "17:00",
      ];
    },
  },
  methods: {
    async buscarEndereco() {
      if (this.agendamento.cep.length === 8) {
        try {
          const response = await axios.get(
            `https://viacep.com.br/ws/${this.agendamento.cep}/json/`
          );

          if (response.data.erro) {
            this.erro = "CEP não encontrado";
            return;
          }

          this.agendamento.rua = response.data.logradouro || "";
          this.agendamento.cidade = response.data.localidade || "";
          this.erro = "";

          // Busca previsão do tempo se tiver cidade
          if (response.data.localidade) {
            this.buscarPrevisaoTempo(response.data.localidade);
          }
        } catch (erro) {
          this.erro = "Erro ao buscar CEP";
        }
      }
    },

    async buscarPrevisaoTempo(cidade) {
      try {
        // Simulação - depois integramos com API real
        const previsoes = [
          "☀️ Ensolarado - 28°C",
          "⛅ Parcialmente nublado - 25°C",
          "🌧️ Chuvoso - 20°C",
          "🌤️ Poucas nuvens - 27°C",
        ];

        this.previsaoTempo =
          previsoes[Math.floor(Math.random() * previsoes.length)];
      } catch (erro) {
        console.error("Erro ao buscar previsão:", erro);
      }
    },

    async agendarConsulta() {
      this.carregando = true;
      this.erro = "";
      this.sucesso = "";

      try {
        // 1. Formata os dados do agendamento
        const agendamentoCompleto = {
          data: this.agendamento.data,
          hora: this.agendamento.hora,
          endereco: {
            rua: this.agendamento.rua,
            cidade: this.agendamento.cidade,
          },
          sintomas: this.agendamento.sintomas,
          clima: this.previsaoTempo,
          pacienteId: this.$store.state.usuario?.id,
        };

        // 2. Salva no Vuex Store
        await this.$store.dispatch("adicionarAgendamento", agendamentoCompleto);

        this.sucesso = "Consulta agendada com sucesso! 🎉";

        // 3. Limpa formulário
        this.agendamento = {
          data: "",
          hora: "",
          cep: "",
          rua: "",
          cidade: "",
          sintomas: "",
        };
        this.previsaoTempo = "";
      } catch (erro) {
        this.erro = "Erro ao agendar consulta. Tente novamente.";
      } finally {
        this.carregando = false;
      }
    },

    voltarParaDashboard() {
      this.$router.push("/dashboard");
    },
  },
};
</script>

<style scoped>
.agendamento-container {
  min-height: 100vh;
  background: #f5f7fa;
}

.agendamento-content {
  max-width: 800px;
  margin: 0 auto;
  padding: 2rem;
}

.welcome-section {
  text-align: center;
  margin-bottom: 2rem;
}

.welcome-section h1 {
  color: #2d3748;
  margin-bottom: 0.5rem;
}

.welcome-section p {
  color: #718096;
}

.agendamento-form {
  background: white;
  padding: 2rem;
  border-radius: 12px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
}

.form-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
  margin-bottom: 1rem;
}

.weather-info {
  background: #e6f7ff;
  padding: 1rem;
  border-radius: 8px;
  margin-bottom: 1.5rem;
  border-left: 4px solid #1890ff;
}

.weather-info h3 {
  margin-bottom: 0.5rem;
  color: #1890ff;
}

.btn-voltar {
  background: #718096;
  color: white;
  padding: 8px 16px;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-weight: 600;
}

.btn-voltar:hover {
  background: #4a5568;
}

@media (max-width: 768px) {
  .form-row {
    grid-template-columns: 1fr;
  }

  .agendamento-content {
    padding: 1rem;
  }
}
</style>
