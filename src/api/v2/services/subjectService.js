import prisma from "../../../config/database.js";
import { ConflictError, NotFoundError } from "../../../errors/AppError.js";

export async function getAllSubjects() {
  return prisma.subject.findMany({
    orderBy: { createdAt: "desc" },
    include: { professor: { select: { id: true, nome: true, email: true } } },
  });
}

export async function getSubjectById(id) {
  const subject = await prisma.subject.findUnique({
    where: { id },
    include: { professor: { select: { id: true, nome: true, email: true } } },
  });
  if (!subject) throw new NotFoundError(`Matéria com ID ${id} não encontrada`);
  return subject;
}

export async function createSubject(data) {
  const professor = await prisma.user.findUnique({
    where: { id: data.professorId },
  });
  if (!professor)
    throw new NotFoundError(
      `Professor com ID ${data.professorId} não encontrado`,
    );

  return prisma.subject.create({
    data,
    include: { professor: { select: { id: true, nome: true, email: true } } },
  });
}

export async function updateSubject(id, data) {
  await getSubjectById(id);
  if (data.professorId) {
    const professor = await prisma.user.findUnique({
      where: { id: data.professorId },
    });
    if (!professor)
      throw new NotFoundError(
        `Professor com ID ${data.professorId} não encontrado`,
      );
  }

  return prisma.subject.update({
    where: { id },
    data,
    include: { professor: { select: { id: true, nome: true, email: true } } },
  });
}

export async function deleteSubject(id) {
  const subject = await prisma.subject.findUnique({
    where: { id },
    include: { _count: { select: { questions: true } } },
  });
  if (!subject) throw new NotFoundError(`Matéria com ID ${id} não encontrada`);
  if (subject._count.questions > 0) {
    throw new ConflictError("Matéria possui questões vinculadas");
  }

  return prisma.subject.delete({
    where: { id },
    include: { professor: { select: { id: true, nome: true, email: true } } },
  });
}
