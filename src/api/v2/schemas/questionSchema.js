import { z } from "zod";
import { positiveIdSchema } from "../../../schemas/idSchema.js";

const optionalQuestionFields = {
  enunciado: z
    .string()
    .trim()
    .min(3, "Enunciado deve ter pelo menos 3 caracteres")
    .max(500, "Enunciado deve ter no máximo 500 caracteres")
    .optional(),
  dificuldade: z
    .number()
    .int("Dificuldade deve ser um número inteiro")
    .min(1, "Dificuldade mínima é 1")
    .max(3, "Dificuldade máxima é 3")
    .optional(),
  respostaCorreta: z
    .union([
      z
        .string()
        .trim()
        .min(1)
        .max(500, "Resposta correta deve ter no máximo 500 caracteres"),
      z.null(),
    ])
    .optional(),
  subjectId: positiveIdSchema.optional(),
  authorId: positiveIdSchema.optional(),
  ativa: z.boolean().optional(),
};

export const createQuestionV2Schema = z
  .object({
    enunciado: optionalQuestionFields.enunciado.unwrap(),
    dificuldade: optionalQuestionFields.dificuldade.unwrap(),
    respostaCorreta: optionalQuestionFields.respostaCorreta,
    subjectId: optionalQuestionFields.subjectId.unwrap(),
    authorId: optionalQuestionFields.authorId.unwrap(),
    ativa: optionalQuestionFields.ativa,
  })
  .strict();

export const updateQuestionV2Schema = z
  .object(optionalQuestionFields)
  .strict()
  .refine((data) => Object.keys(data).length > 0, {
    message: "Envie pelo menos um campo para atualização",
  });

export const idParamSchema = z.object({ id: positiveIdSchema });
