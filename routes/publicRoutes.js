import express from "express";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";
import {
  generate_acess_token,
  generate_refresh_token,
} from "../controllers/generateTokens.js";

const router = express.Router();
const prisma = new PrismaClient();

router.post("/cadastro_usuarios", async (req, res) => {
  const { email, name, password } = req.body;

  try {
    const email_exist = await prisma.user.findUnique({
      where: {
        email,
      },
    });

    if (email_exist) {
      return res.status(409).json({ message: "O email já foi cadastrado" });
    }

    const salt = await bcrypt.genSalt(10);
    const hash_password = await bcrypt.hash(password, salt);

    const new_user = await prisma.user.create({
      data: {
        email,
        name,
        password: hash_password,
      },
    });

    return res
      .status(201)
      .json({ message: "o usuário foi criado com sucesso" });
  } catch (err) {
    console.log(err);
    res
      .status(500)
      .json({
        message:
          "O servidor se encontra com problemas. Tente novamente mais tarde.",
      });
  }
});

router.post("/login", async (req, res) => {
  const { email, password } = req.body;
  try {
    const user_exist = await prisma.user.findUnique({
      where: {
        email,
      },
    });

    if (!user_exist) {
      return res
        .status(404)
        .json({ message: "Email está inválido. Tente novamente" });
    }

    const is_math = await bcrypt.compare(password, user_exist.password);

    if (!is_math) {
      return res
        .status(404)
        .json({ message: "Senha inválida. Tente novamente" });
    }
    const acess_token = generate_acess_token(user_exist);
    const refresh_token = generate_refresh_token(user_exist);

    res.status(200).json({
      user: {
        name: user_exist.name,
        email: user_exist.email,
      },
      acess_token,
      refresh_token,
    });
  } catch (err) {
    console.log(err);
    res
      .status(500)
      .json({
        message:
          " O servidor se encontra com problemas. Tente novamente mais tarde.",
      });
  }
});

export default router;
