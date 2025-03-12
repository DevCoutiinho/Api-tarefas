import express from "express";
import { PrismaClient } from "@prisma/client";

const router = express.Router();
const prisma = new PrismaClient();

router.post("/adicionar_tarefas", async (req, res) => {
  const { id } = req.user;
  const { title, content } = req.body;

  try {
    const create_task = await prisma.task.create({
      data: {
        title,
        content,
        user: {
          connect: { id },
        },
      },
    });

    return res.status(201).json(create_task);
  } catch (err) {
    console.log(err);
    return res.status(500).json({
      message:
        "O servidor se encontra com problemas. Tente novamente mais tarde.",
    });
  }
});

router.get("/listar_tarefas", async (req, res) => {
  const { id } = req.user;

  try {
    const tasks = await prisma.task.findMany({
      where: {
        userId: id,
      },
    });

    if (tasks.length === 0) {
      return res.status(404).json({ message: "Nenhuma tarefa foi encontrada" });
    }

    return res.status(200).json(tasks);
  } catch (err) {
    console.log(err);
    return res.status(500).json({
      message:
        "O servidor se encontra com problemas. Tente novamente mais tarde.",
    });
  }
});

router.patch("/atualizar_tarefa_completa", async (req, res) => {
  const userId = req.user.id;
  const { id } = req.query;
  try {
    const task = await prisma.task.findUnique({
      where: {
        id: Number(id),
      },
    });
    if (!task) {
      return res
        .status(404)
        .json({ message: " Nenhuma tarefa foi encontrada" });
    }

    if (task.userId !== userId) {
      return res.status(401).json({
        message: "Você não possui autorização pra atualizar essa tarefa",
      });
    }

    const new_task = await prisma.task.update({
      where: {
        id: Number(id),
      },
      data: {
        completed: true,
      },
    });

    return res.status(200).json(new_task);
  } catch (err) {
    return res.status(500).json({
      message:
        "O servidor se encontra com problemas. Tente novamente mais tarde.",
    });
  }
});

router.patch("/atualizar_titulo_tarefa", async (req, res) => {
  const userId = req.user.id;
  const { id } = req.query;
  const { title } = req.body;
  try {
    const task = await prisma.task.findUnique({
      where: {
        id: Number(id),
      },
    });

    if (!task) {
      return res.status(404).json({ message: "Nenhuma tarefa foi encontrada" });
    }

    if (task.userId !== userId) {
      return res.status(401).json({
        message: "Você não possui autorização pra atualizar essa tarefa",
      });
    }

    const new_task = await prisma.task.update({
      where: {
        id: Number(id),
      },
      data: {
        title,
      },
    });

    return res.status(200).json(new_task);
  } catch (err) {
    return res.status(500).json({
      message:
        "O servidor se encontra com problemas. Tente novamente mais tarde.",
    });
  }
});

router.patch("/atualizar_conteudo_tarefa", async (req, res) => {
  const userId = req.user.id;
  const { id } = req.query;
  const { content } = req.body;

  try {
    const task = await prisma.task.findUnique({
      where: {
        id: Number(id),
      },
    });

    if (!task) {
      return res.status(404).json({ message: "Nenhuma tarefa foi encontrada" });
    }

    if (task.userId !== userId) {
      return res.status(401).json({
        message: "Você não possui autorização pra atualizar essa tarefa",
      });
    }

    const new_task = await prisma.task.update({
      where: {
        id: Number(id),
      },
      data: {
        content,
      },
    });

    return res.status(200).json(new_task);
  } catch (err) {
    return res.status(500).json({
      message:
        "O servidor se encontra com problemas. Tente novamente mais tarde.",
    });
  }
});

router.patch("/atualizar_tarefa_incompleta", async (req, res) => {
  const userId = req.user.id;
  const { id } = req.query;

  try {
    const task = await prisma.task.findUnique({
      where: {
        id: Number(id),
      },
    });

    if (!task) {
      return res.status(404).json({ message: "Nenhuma tarefa foi encontrada" });
    }

    if (task.userId !== userId) {
      return res.status(401).json({
        message: "Você não possui autorização pra atualizar essa tarefa",
      });
    }

    const new_task = await prisma.task.update({
      where: {
        id: Number(id),
      },
      data: {
        completed: false,
      },
    });
    return res.status(200).json(new_task);
  } catch (err) {
    console.log(err);
    return res.status(500).json({
      message:
        "O servidor se encontra com problemas. Tente novamente mais tarde.",
    });
  }
});

router.delete("/deletar_tarefa", async (req, res) => {
  const userId = req.user.id;
  const { id } = req.query;

  try {
    const task = await prisma.task.findUnique({
      where: {
        id: Number(id),
      },
    });

    if (!task) {
      return res.status(404).json({ message: "Nenhuma tarefa foi encontrada" });
    }

    if (task.userId !== userId) {
      return res
        .status(401)
        .json({
          message: "Você não possui autorização pra atualizar essa tarefa",
        });
    }

    const delete_task = await prisma.task.delete({
      where: {
        id: Number(id),
      },
    });

    return res
      .status(200)
      .json({ message: "A tarefa foi deletada com sucesso" });
  } catch (err) {
    return res.status(500).json({
      message:
        "O servidor se encontra com problemas. Tente novamente mais tarde.",
    });
  }
});

export default router;
