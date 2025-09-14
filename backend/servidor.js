const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const app = express();
const PORTA = process.env.PORTA || 5000;

// Middlewares
app.use(cors());
app.use(express.json());

// Conexão com MongoDB
mongoose
  .connect(process.env.MONGODB_URI || "mongodb://localhost:27017/clinica", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("✅ Conectado ao MongoDB!"))
  .catch((err) => console.log("❌ Erro ao conectar MongoDB:", err));

// Importar rotas
const rotasAutenticacao = require("./rotas/autenticacao");
const rotasAgendamentos = require("./rotas/agendamentos");
const rotasAdmin = require("./rotas/admin");

// Usar rotas
app.use("/api/autenticacao", rotasAutenticacao);
app.use("/api/agendamentos", rotasAgendamentos);
app.use("/api/admin", rotasAdmin);

// Rota teste pra ver se tá funcionando
app.get("/", (req, res) => {
  res.json({
    message: "✅ API da Clínica funcionando! 🏥",
    rotas: {
      autenticacao: "/api/autenticacao",
      agendamentos: "/api/agendamentos",
      admin: "/api/admin",
    },
  });
});

// Rota pra qualquer outra coisa não encontrada
app.use("*", (req, res) => {
  res.status(404).json({ erro: "Rota não encontrada" });
});

// Iniciar servidor
app.listen(PORTA, () => {
  console.log(`🚀 Servidor rodando na porta ${PORTA}`);
  console.log(`📋 Endereço: http://localhost:${PORTA}`);
});

// Tratamento de erros não capturados
process.on("unhandledRejection", (err) => {
  console.log("❌ Erro não tratado:", err);
  process.exit(1);
});
