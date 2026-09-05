import express from "express";
import prisma from "./config/database.js";
import subjectRoutes from "./routes/subjectRoutes.js";
import questionRoutes from "./routes/questionRoutes.js";

const app = express();

app.use(express.json());

// Rotas de matérias
app.use("/subjects", subjectRoutes);

// Rotas de questões
app.use("/questions", questionRoutes);

// Health Check
app.get("/health", async (req, res) => {
  try {
    await prisma.$queryRaw`SELECT 1`;

    res.status(200).json({
      status: "OK",
      message: "API do Gerador de Provas",
      timestamp: new Date().toISOString(),
      services: {
        api: "OK",
        database: {
          status: "OK",
        },
      },
    });
  } catch (error) {
    res.status(500).json({
      status: "ERROR",
      message: "Erro ao verificar o banco de dados",
    });
  }
});

// Listar usuários
app.get("/users", async (req, res) => {
  try {
    const users = await prisma.user.findMany({
      select: {
        id: true,
        nome: true,
        email: true,
        foto: true,
        papel: true,
        createdAt: true,
        updatedAt: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    res.status(200).json({
      success: true,
      data: users,
      total: users.length,
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
    const { nome, email, papel, foto } = req.body;

    if (!nome || !email) {
      return res.status(400).json({
        success: false,
        message: "Nome e email são obrigatórios",
      });
    }

    const existingUser = await prisma.user.findUnique({
      where: {
        email,
      },
    });

    if (existingUser) {
      return res.status(409).json({
        success: false,
        message: "Email já cadastrado",
      });
    }

    const user = await prisma.user.create({
      data: {
        nome,
        email,
        papel: papel || "PROFESSOR",
        foto: foto || null,
      },
      select: {
        id: true,
        nome: true,
        email: true,
        foto: true,
        papel: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    res.status(201).json({
      success: true,
      data: user,
    });
  } catch (error) {
    console.error("Erro ao criar usuário:", error);

    if (error.code === "P2002") {
      return res.status(409).json({
        success: false,
        message: "Email já cadastrado",
      });
    }

    res.status(500).json({
      success: false,
      message: "Erro ao criar usuário",
    });
  }
});

// Rota para endpoints que não existem
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: "Rota não encontrada",
  });
});

export default app;