const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const schemaUsuario = new mongoose.Schema(
  {
    nome: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    senha: { type: String, required: true },
    tipo: {
      type: String,
      enum: ["paciente", "secretario"],
      default: "paciente",
    },
    cep: { type: String },
    endereco: {
      rua: String,
      cidade: String,
      estado: String,
    },
  },
  { timestamps: true }
);

// Criptografa senha antes de salvar
schemaUsuario.pre("save", async function (proximo) {
  if (!this.isModified("senha")) return proximo();
  this.senha = await bcrypt.hash(this.senha, 12);
  proximo();
});

// Compara senhas
schemaUsuario.methods.compararSenha = async function (senhaDigitada) {
  return await bcrypt.compare(senhaDigitada, this.senha);
};

module.exports = mongoose.model("Usuario", schemaUsuario);
