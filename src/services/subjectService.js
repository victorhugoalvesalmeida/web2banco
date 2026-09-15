import prisma from "../config/database.js";

export async function getAllSubjects() {
  return await prisma.subject.findMany({
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
      createdAt: "desc",
    },
  });
}

export async function getSubjectById(id) {
  return await prisma.subject.findUnique({
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
}

export async function createSubject({ nome, professorId, ativa = true }) {
  const professor = await prisma.user.findUnique({
    where: { id: professorId },
  });

  if (!professor) {
    const error = new Error("Professor não encontrado");
    error.code = "PROFESSOR_NOT_FOUND";
    throw error;
  }

  return await prisma.subject.create({
    data: {
      nome,
      professorId,
      ativa,
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
}

export async function updateSubject(id, data) {
  if (data.professorId !== undefined) {
    const professor = await prisma.user.findUnique({
      where: { id: data.professorId },
    });

    if (!professor) {
      const error = new Error("Professor não encontrado");
      error.code = "PROFESSOR_NOT_FOUND";
      throw error;
    }
  }

  return await prisma.subject.update({
    where: { id },
    data,
    select: {
      id: true,
      nome: true,
      ativa: true,
      professorId: true,
      createdAt: true,
      updatedAt: true,
    },
  });
}

export async function deleteSubject(id) {
  const subject = await prisma.subject.findUnique({
    where: { id },
    select: {
      id: true,
      questions: {
        select: {
          id: true,
        },
        take: 1,
      },
    },
  });

  if (!subject) {
    const error = new Error("Matéria não encontrada");
    error.code = "SUBJECT_NOT_FOUND";
    throw error;
  }

  if (subject.questions.length > 0) {
    const error = new Error("Matéria possui questões vinculadas");
    error.code = "SUBJECT_IN_USE";
    throw error;
  }

  await prisma.subject.delete({
    where: { id },
  });
}
