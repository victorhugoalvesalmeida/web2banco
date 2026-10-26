import { z } from "zod";
import { positiveIdSchema } from "../../../schemas/idSchema.js";

const optionalSubjectFields = {
  nome: z
    .string()
    .trim()
    .min(3, "Nome deve ter pelo menos 3 caracteres")
    .max(100, "Nome deve ter no máximo 100 caracteres")
    .optional(),
  professorId: positiveIdSchema.optional(),
  ativa: z.boolean().optional(),
};

export const createSubjectV2Schema = z
  .object({
    nome: optionalSubjectFields.nome.unwrap(),
    professorId: optionalSubjectFields.professorId.unwrap(),
    ativa: optionalSubjectFields.ativa,
  })
  .strict();

export const updateSubjectV2Schema = z
  .object(optionalSubjectFields)
  .strict()
  .refine((data) => Object.keys(data).length > 0, {
    message: "Envie pelo menos um campo para atualização",
  });

export const idParamSchema = z.object({ id: positiveIdSchema });
