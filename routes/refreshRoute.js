import express from "express";
import jwt from "jsonwebtoken";
import {
  generate_acess_token,
  generate_refresh_token,
} from "../controllers/generateTokens.js";

const router = express.Router();
const SECRET_REFRESH_TOKEN = process.env.SECRET_REFRESH_TOKEN;

router.post("/refresh", async (req, res) => {
  const { refresh_token } = req.body;

  if (!refresh_token) {
    return res
      .status(401)
      .json({ message: "O token de atualização não foi fornecido" });
  }

  try {
    const decode = jwt.verify(refresh_token, SECRET_REFRESH_TOKEN);
    const acess_token = generate_acess_token(decode);
    
    return res.status(200).json({ acess_token: acess_token });
    
  } catch (err) {
    return res
      .status(401)
      .json({ message: "O token de atualização está inválido" });
  }
});

export default router;
