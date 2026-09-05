import prisma from "../config/database.js";

export const create = async (req, res) => {
  try {
    const { nome, professorId, ativa } = req.body;

    if (!nome || !professorId) {
      return res.status(400).json({
        success: false,
        message: "nome e professorId são obrigatórios",
      });
    }

    if (!Number.isInteger(Number(professorId)) || Number(professorId) <= 0) {
      return res.status(400).json({
        success: false,
        message: "professorId deve ser um número inteiro positivo",
      });
    }

    const professor = await prisma.user.findUnique({
      where: { id: Number(professorId) },
    });

    if (!professor) {
      return res.status(404).json({
        success: false,
        message: "Professor não encontrado",
      });
    }

    const materia = await prisma.subject.create({
      data: {
        nome,
        professorId: Number(professorId),
        ativa: ativa ?? true,
      },
      select: {
        id: true,
        nome: true,
        ativa: true,
        professorId: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    return res.status(201).json({
      success: true,
      data: materia,
    });
  } catch (error) {
    console.error("Erro ao criar matéria:", error);

    if (error?.code === "P2002") {
      return res.status(409).json({
        success: false,
        message: "Matéria já cadastrada",
      });
    }

    return res.status(500).json({
      success: false,
      message: "Erro ao criar matéria",
    });
  }
};export const getAll = async (req, res) => {
  try {
    const materias = await prisma.subject.findMany({
      select: {
        id: true,
        nome: true,
        ativa: true,
        professorId: true,
        createdAt: true,
        updatedAt: true,
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

    return res.status(200).json({
      success: true,
      data: materias,
      total: materias.length,
    });
  } catch (error) {
    console.error("Erro ao buscar matérias:", error);

    return res.status(500).json({
      success: false,
      message: "Erro ao buscar matérias",
    });
  }
};

export const getById = async (req, res) => {
  try {
    const id = Number(req.params.id);

    if (!Number.isInteger(id) || id <= 0) {
      return res.status(400).json({
        success: false,
        message: "ID deve ser um número inteiro positivo",
      });
    }

    const materia = await prisma.subject.findUnique({
      where: { id },
      select: {
        id: true,
        nome: true,
        ativa: true,
        professorId: true,
        createdAt: true,
        updatedAt: true,
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
    });

    if (!materia) {
      return res.status(404).json({
        success: false,
        message: "Matéria não encontrada",
      });
    }

    return res.status(200).json({
      success: true,
      data: materia,
    });
  } catch (error) {
    console.error("Erro ao buscar matéria:", error);

    return res.status(500).json({
      success: false,
      message: "Erro ao buscar matéria",
    });
  }
};