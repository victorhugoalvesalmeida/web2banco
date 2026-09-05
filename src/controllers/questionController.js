import prisma from "../config/database.js";

export const create = async (req, res) => {
  try {
    const {
      enunciado,
      dificuldade,
      respostaCorreta,
      subjectId,
      authorId,
      ativa,
    } = req.body;

    if (!enunciado || dificuldade === undefined || !subjectId || !authorId) {
      return res.status(400).json({
        success: false,
        message:
          "enunciado, dificuldade, subjectId e authorId são obrigatórios",
      });
    }

    if (
      !Number.isInteger(Number(dificuldade)) ||
      ![1, 2, 3].includes(Number(dificuldade))
    ) {
      return res.status(400).json({
        success: false,
        message: "dificuldade deve ser 1, 2 ou 3",
      });
    }

    if (!Number.isInteger(Number(subjectId)) || Number(subjectId) <= 0) {
      return res.status(400).json({
        success: false,
        message: "subjectId deve ser um número inteiro positivo",
      });
    }

    if (!Number.isInteger(Number(authorId)) || Number(authorId) <= 0) {
      return res.status(400).json({
        success: false,
        message: "authorId deve ser um número inteiro positivo",
      });
    }

    const subject = await prisma.subject.findUnique({
      where: {
        id: Number(subjectId),
      },
    });

    if (!subject) {
      return res.status(404).json({
        success: false,
        message: "Matéria não encontrada",
      });
    }

    const author = await prisma.user.findUnique({
      where: {
        id: Number(authorId),
      },
    });

    if (!author) {
      return res.status(404).json({
        success: false,
        message: "Autor não encontrado",
      });
    }

    const questao = await prisma.question.create({
      data: {
        enunciado,
        dificuldade: Number(dificuldade),
        respostaCorreta,
        subjectId: Number(subjectId),
        authorId: Number(authorId),
        ativa: ativa ?? true,
      },
      select: {
        id: true,
        enunciado: true,
        dificuldade: true,
        respostaCorreta: true,
        subjectId: true,
        authorId: true,
        ativa: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    return res.status(201).json({
      success: true,
      data: questao,
    });
  } catch (error) {
    console.error("Erro ao criar questão:", error);

    return res.status(500).json({
      success: false,
      message: "Erro ao criar questão",
    });
  }
};

export const getAll = async (req, res) => {
  try {
    const questoes = await prisma.question.findMany({
      select: {
        id: true,
        enunciado: true,
        dificuldade: true,
        respostaCorreta: true,
        subjectId: true,
        authorId: true,
        ativa: true,
        createdAt: true,
        updatedAt: true,
        subject: {
          select: {
            id: true,
            nome: true,
            ativa: true,
          },
        },
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

    return res.status(200).json({
      success: true,
      data: questoes,
      total: questoes.length,
    });
  } catch (error) {
    console.error("Erro ao buscar questões:", error);

    return res.status(500).json({
      success: false,
      message: "Erro ao buscar questões",
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

    const questao = await prisma.question.findUnique({
      where: {
        id,
      },
      select: {
        id: true,
        enunciado: true,
        dificuldade: true,
        respostaCorreta: true,
        subjectId: true,
        authorId: true,
        ativa: true,
        createdAt: true,
        updatedAt: true,
        subject: {
          select: {
            id: true,
            nome: true,
            ativa: true,
          },
        },
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
    });

    if (!questao) {
      return res.status(404).json({
        success: false,
        message: "Questão não encontrada",
      });
    }

    return res.status(200).json({
      success: true,
      data: questao,
    });
  } catch (error) {
    console.error("Erro ao buscar questão:", error);

    return res.status(500).json({
      success: false,
      message: "Erro ao buscar questão",
    });
  }
};