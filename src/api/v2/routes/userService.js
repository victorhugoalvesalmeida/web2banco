import prisma from "../../../config/database.js";
import { ConflictError, NotFoundError } from "../../../errors/AppError.js";
import { uploadToUploadcare } from "./uploadService.js";

export async function listUsers() {
  return prisma.user.findMany();
}

export async function getUserById(id) {
  const user = await prisma.user.findUnique({ where: { id } });
  if (!user) throw new NotFoundError("Usuário não encontrado");
  return user;
}

export async function createUser(data, file) {
  const owner = await prisma.user.findUnique({ where: { email: data.email } });
  if (owner) throw new ConflictError("E-mail já cadastrado");

  const foto = file
    ? await uploadToUploadcare(file.buffer, file.mimetype)
    : data.foto ?? null;

  const tipoUsuario = data.tipoUsuario ?? "professor";

  return prisma.user.create({
    data: {
      primeiroNome: data.primeiroNome,
      sobrenome: data.sobrenome,
      email: data.email,
      telefone: data.telefone ?? null,
      tipoUsuario,
      foto,
    },
  });
}

export async function updateUser(userId, data, file) {
  const user = await prisma.user.findUnique({ where: { id: userId } });
  if (!user) throw new NotFoundError("Usuário não encontrado");

  if (data.email && data.email !== user.email) {
    const owner = await prisma.user.findUnique({ where: { email: data.email } });
    if (owner) throw new ConflictError("E-mail já cadastrado");
  }

  const synchronizedData = { ...data };

  if (file) {
    synchronizedData.foto = await uploadToUploadcare(file.buffer, file.mimetype);
  }

  return prisma.user.update({
    where: { id: userId },
    data: synchronizedData,
  });
}

export async function deleteUser(id) {
  const user = await prisma.user.findUnique({ where: { id } });
  if (!user) throw new NotFoundError("Usuário não encontrado");
  return prisma.user.delete({ where: { id } });
}