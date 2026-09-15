import express from "express";
import prisma from "./config/database.js";
import subjectRoutes from "./routes/subjectRoutes.js";
import questionRoutes from "./routes/questionRoutes.js";
import userRoutes from "./routes/userRoutes.js";

const app = express();

app.use(express.json());

// Rotas de usuários
app.use("/users", userRoutes);

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
    console.error("Erro ao verificar o banco de dados:", error);

    res.status(500).json({
      status: "ERROR",
      message: "Erro ao verificar o banco de dados",
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
