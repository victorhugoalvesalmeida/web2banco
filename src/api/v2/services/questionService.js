import prisma from "../../../config/database.js";
import { NotFoundError } from "../../../errors/AppError.js";

export async function getAllQuestions() {
  return prisma.question.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      subject: true,
      author: { select: { id: true, nome: true, email: true } },
    },
  });
}

export async function getQuestionById(id) {
  const question = await prisma.question.findUnique({
    where: { id },
    include: {
      subject: true,
      author: { select: { id: true, nome: true, email: true } },
    },
  });
  if (!question) throw new NotFoundError(`Questão com ID ${id} não encontrada`);
  return question;
}

export async function createQuestion(data) {
  const subject = await prisma.subject.findUnique({
    where: { id: data.subjectId },
  });
  if (!subject)
    throw new NotFoundError(`Matéria com ID ${data.subjectId} não encontrada`);

  const author = await prisma.user.findUnique({ where: { id: data.authorId } });
  if (!author)
    throw new NotFoundError(`Autor com ID ${data.authorId} não encontrado`);

  return prisma.question.create({
    data,
    include: {
      subject: true,
      author: { select: { id: true, nome: true, email: true } },
    },
  });
}

export async function updateQuestion(id, data) {
  await getQuestionById(id);
  if (data.subjectId) {
    const subject = await prisma.subject.findUnique({
      where: { id: data.subjectId },
    });
    if (!subject)
      throw new NotFoundError(
        `Matéria com ID ${data.subjectId} não encontrada`,
      );
  }
  if (data.authorId) {
    const author = await prisma.user.findUnique({
      where: { id: data.authorId },
    });
    if (!author)
      throw new NotFoundError(`Autor com ID ${data.authorId} não encontrado`);
  }

  return prisma.question.update({
    where: { id },
    data,
    include: {
      subject: true,
      author: { select: { id: true, nome: true, email: true } },
    },
  });
}

export async function deleteQuestion(id) {
  await getQuestionById(id);
  return prisma.question.delete({
    where: { id },
    include: {
      subject: true,
      author: { select: { id: true, nome: true, email: true } },
    },
  });
}
