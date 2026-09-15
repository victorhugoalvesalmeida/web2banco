import prisma from "../config/database.js";

export async function getAllUsers() {
  return await prisma.user.findMany({
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
}

export async function getUserById(id) {
  return await prisma.user.findUnique({
    where: { id },
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
}

export async function createUser({
  nome,
  email,
  papel = "PROFESSOR",
  foto = null,
}) {
  const existingUser = await prisma.user.findUnique({
    where: { email },
  });

  if (existingUser) {
    const error = new Error("Email já cadastrado");
    error.code = "EMAIL_ALREADY_EXISTS";
    throw error;
  }

  return await prisma.user.create({
    data: {
      nome,
      email,
      papel,
      foto,
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
}

export async function updateUser(id, data) {
  if (data.email !== undefined) {
    const existingUser = await prisma.user.findUnique({
      where: { email: data.email },
    });

    if (existingUser && existingUser.id !== id) {
      const error = new Error("Email já cadastrado");
      error.code = "EMAIL_ALREADY_EXISTS";
      throw error;
    }
  }

  return await prisma.user.update({
    where: { id },
    data,
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
}

export async function deleteUser(id) {
  const user = await prisma.user.findUnique({
    where: { id },
  });

  if (!user) {
    const error = new Error("Usuário não encontrado");
    error.code = "USER_NOT_FOUND";
    throw error;
  }

  const subject = await prisma.subject.findFirst({
    where: { professorId: id },
    select: {
      id: true,
    },
  });

  if (subject) {
    const error = new Error("Usuário possui matérias vinculadas");
    error.code = "USER_IN_USE";
    throw error;
  }

  const question = await prisma.question.findFirst({
    where: { authorId: id },
    select: {
      id: true,
    },
  });

  if (question) {
    const error = new Error("Usuário possui questões vinculadas");
    error.code = "USER_IN_USE";
    throw error;
  }

  await prisma.user.delete({
    where: { id },
  });
}
