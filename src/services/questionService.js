import prisma from "../config/database.js";

export async function getAllQuestions() {
  return await prisma.question.findMany({
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
      createdAt: "desc",
    },
  });
}

export async function getQuestionById(id) {
  return await prisma.question.findUnique({
    where: { id },
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
}

export async function createQuestion({
  enunciado,
  dificuldade,
  respostaCorreta = null,
  subjectId,
  authorId,
  ativa = true,
}) {
  const subject = await prisma.subject.findUnique({
    where: { id: subjectId },
  });

  if (!subject) {
    const error = new Error("Matéria não encontrada");
    error.code = "SUBJECT_NOT_FOUND";
    throw error;
  }

  const author = await prisma.user.findUnique({
    where: { id: authorId },
  });

  if (!author) {
    const error = new Error("Autor não encontrado");
    error.code = "AUTHOR_NOT_FOUND";
    throw error;
  }

  return await prisma.question.create({
    data: {
      enunciado,
      dificuldade,
      respostaCorreta,
      subjectId,
      authorId,
      ativa,
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
}

export async function updateQuestion(id, data) {
  if (data.subjectId !== undefined) {
    const subject = await prisma.subject.findUnique({
      where: { id: data.subjectId },
    });

    if (!subject) {
      const error = new Error("Matéria não encontrada");
      error.code = "SUBJECT_NOT_FOUND";
      throw error;
    }
  }

  if (data.authorId !== undefined) {
    const author = await prisma.user.findUnique({
      where: { id: data.authorId },
    });

    if (!author) {
      const error = new Error("Autor não encontrado");
      error.code = "AUTHOR_NOT_FOUND";
      throw error;
    }
  }

  return await prisma.question.update({
    where: { id },
    data,
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
}

export async function deleteQuestion(id) {
  const question = await prisma.question.findUnique({
    where: { id },
    select: {
      id: true,
    },
  });

  if (!question) {
    const error = new Error("Questão não encontrada");
    error.code = "QUESTION_NOT_FOUND";
    throw error;
  }

  await prisma.question.delete({
    where: { id },
  });
}
