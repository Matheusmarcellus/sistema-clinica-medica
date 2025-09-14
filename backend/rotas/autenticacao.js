const express = require("express");
const jwt = require("jsonwebtoken");
const Usuario = require("../modelos/Usuario");

const roteador = express.Router();

// Login
roteador.post("/login", async (req, res) => {
  try {
    const { email, senha } = req.body;

    const usuario = await Usuario.findOne({ email });
    if (!usuario || !(await usuario.compararSenha(senha))) {
      return res.status(401).json({ erro: "Email ou senha inválidos" });
    }

    const token = jwt.sign(
      { usuarioId: usuario._id, tipo: usuario.tipo },
      process.env.JWT_SECRETO || "seuSegredoSuperSecreto",
      { expiresIn: "24h" }
    );

    res.json({
      token,
      usuario: {
        id: usuario._id,
        nome: usuario.nome,
        tipo: usuario.tipo,
      },
    });
  } catch (erro) {
    res.status(500).json({ erro: "Erro no servidor" });
  }
});

// Cadastro
roteador.post("/cadastro", async (req, res) => {
  try {
    const { nome, email, senha, tipo, cep } = req.body;

    const usuarioExiste = await Usuario.findOne({ email });
    if (usuarioExiste) {
      return res.status(400).json({ erro: "Usuário já existe" });
    }

    const usuario = await Usuario.create({ nome, email, senha, tipo, cep });

    const token = jwt.sign(
      { usuarioId: usuario._id, tipo: usuario.tipo },
      process.env.JWT_SECRETO || "seuSegredoSuperSecreto",
      { expiresIn: "24h" }
    );

    res.status(201).json({
      token,
      usuario: {
        id: usuario._id,
        nome: usuario.nome,
        tipo: usuario.tipo,
      },
    });
  } catch (erro) {
    res.status(500).json({ erro: "Erro ao criar usuário" });
  }
});

module.exports = roteador;
