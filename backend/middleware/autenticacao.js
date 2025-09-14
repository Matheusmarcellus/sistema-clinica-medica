const jwt = require("jsonwebtoken");
const Usuario = require("../modelos/Usuario");

module.exports = async (req, res, proximo) => {
  try {
    const token = req.header("Authorization")?.replace("Bearer ", "");

    if (!token) {
      return res.status(401).json({ erro: "Acesso negado. Token necessário." });
    }

    const decodificado = jwt.verify(
      token,
      process.env.JWT_SECRETO || "seuSegredoSuperSecreto"
    );
    const usuario = await Usuario.findById(decodificado.usuarioId);

    if (!usuario) {
      return res.status(401).json({ erro: "Token inválido." });
    }

    req.usuarioId = usuario._id;
    req.tipoUsuario = usuario.tipo;
    proximo();
  } catch (erro) {
    res.status(401).json({ erro: "Token inválido." });
  }
};
