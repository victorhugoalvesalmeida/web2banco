import express from "express";
import prisma from "./config/database.js";

const app = express();

app.use(express.json());

// Verificar API e banco
app.get("/health", async (req, res) => {
  try {
    await prisma.$queryRaw`SELECT 1`;

    res.status(200).json({
      status: "OK",
      message: "API do Gerador de Provas",
      timestamp: new Date().toISOString(),
      services: {
        api: "OK",
        database: { status: "OK" },
      },
    });
  } catch (error) {
    console.error("Erro na verificação do banco:", error);

    res.status(503).json({
      status: "DEGRADED",
      message: "API do Gerador de Provas",
      services: {
        api: "OK",
        database: { status: "ERROR" },
      },
    });
  }
});

// Listar usuários
app.get("/users", async (req, res) => {
  try {
    const usuarios = await prisma.user.findMany({
      select: {
        id: true,
        nome: true,
        email: true,
        papel: true,
        foto: true,
        createdAt: true,
      },
      orderBy: { id: "asc" },
    });

    res.status(200).json({
      success: true,
      data: usuarios,
      total: usuarios.length,
    });
  } catch (error) {
    console.error("Erro ao buscar usuários:", error);

    res.status(500).json({
      success: false,
      message: "Erro ao buscar usuários",
    });
  }
});

// Criar usuário
app.post("/users", async (req, res) => {
  try {
    const { nome, email, foto, papel } = req.body;

    const usuario = await prisma.user.create({
      data: {
        nome,
        email,
        foto,
        papel: papel || "PROFESSOR",
      },
    });

    res.status(201).json({
      success: true,
      data: usuario,
    });
  } catch (error) {
    console.error("Erro ao criar usuário:", error);

    res.status(500).json({
      success: false,
      message: "Erro ao criar usuário",
    });
  }
});

// Criar matéria
app.post("/subjects", async (req, res) => {
  try {
    const { nome, professorId, ativa } = req.body;

    const materia = await prisma.subject.create({
      data: {
        nome,
        professorId,
        ativa: ativa ?? true,
      },
    });

    res.status(201).json({
      success: true,
      data: materia,
    });
  } catch (error) {
    console.error("Erro ao criar matéria:", error);

    res.status(500).json({
      success: false,
      message: "Erro ao criar matéria",
    });
  }
});

// Criar questão
app.post("/questions", async (req, res) => {
  try {
    const {
      enunciado,
      dificuldade,
      respostaCorreta,
      subjectId,
      authorId,
      ativa,
    } = req.body;

    const questao = await prisma.question.create({
      data: {
        enunciado,
        dificuldade,
        respostaCorreta,
        subjectId,
        authorId,
        ativa: ativa ?? true,
      },
    });

    res.status(201).json({
      success: true,
      data: questao,
    });
  } catch (error) {
    console.error("Erro ao criar questão:", error);

    res.status(500).json({
      success: false,
      message: "Erro ao criar questão",
    });
  }
});

// Listar matérias com professor
app.get("/subjects", async (req, res) => {
  try {
    const materias = await prisma.subject.findMany({
      include: {
        professor: {
          select: {
            id: true,
            nome: true,
            email: true,
            foto: true,
            papel: true,
          },
        },
      },
      orderBy: {
        id: "asc",
      },
    });

    res.status(200).json({
      success: true,
      data: materias,
      total: materias.length,
    });
  } catch (error) {
    console.error("Erro ao buscar matérias:", error);

    res.status(500).json({
      success: false,
      message: "Erro ao buscar matérias",
    });
  }
});

// Listar questões com matéria e autor
app.get("/questions", async (req, res) => {
  try {
    const questoes = await prisma.question.findMany({
      include: {
        subject: true,
        author: {
          select: {
            id: true,
            nome: true,
            email: true,
            foto: true,
            papel: true,
          },
        },
      },
      orderBy: {
        id: "asc",
      },
    });

    res.status(200).json({
      success: true,
      data: questoes,
      total: questoes.length,
    });
  } catch (error) {
    console.error("Erro ao buscar questões:", error);

    res.status(500).json({
      success: false,
      message: "Erro ao buscar questões",
    });
  }
});

// Rota não encontrada
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: "Rota " + req.method + " " + req.originalUrl + " não encontrada",
  });
});

export default app;