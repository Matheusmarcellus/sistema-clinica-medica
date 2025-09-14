const express = require("express");
const roteador = express.Router();

// Rota temporária só pra testar
roteador.get("/", (req, res) => {
  res.json({ message: "✅ Rota de agendamentos funcionando!" });
});

module.exports = roteador;
