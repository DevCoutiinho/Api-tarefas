import jwt from "jsonwebtoken";

const SECRET_ACESS_TOKEN = process.env.SECRET_ACESS_TOKEN;

const auth = (req, res, next) => {
  try {
    const acess_token = req.headers.authorization;
    if (!acess_token) {
      return res.status(401).json({ message: "Token de acesso não fornecido" });
    }

    const decode = jwt.verify(
      acess_token.replace("Bearer ", ""),
      SECRET_ACESS_TOKEN
    );
    req.user = decode;
  } catch (err) {
    return res.status(501).json({ message: "Token de acesso inválido" });
  }

  next();
};

export default auth;
