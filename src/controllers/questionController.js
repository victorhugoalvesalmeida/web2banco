import * as questionService from "../services/questionService.js";

export async function create(req, res) {
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

    if (typeof enunciado !== "string" || enunciado.trim() === "") {
      return res.status(400).json({
        success: false,
        message: "enunciado deve ser um texto não vazio",
      });
    }

    if (!Number.isInteger(dificuldade) || dificuldade < 1 || dificuldade > 3) {
      return res.status(400).json({
        success: false,
        message: "dificuldade deve ser 1, 2 ou 3",
      });
    }

    if (!Number.isInteger(subjectId) || subjectId <= 0) {
      return res.status(400).json({
        success: false,
        message: "subjectId deve ser um número inteiro positivo",
      });
    }

    if (!Number.isInteger(authorId) || authorId <= 0) {
      return res.status(400).json({
        success: false,
        message: "authorId deve ser um número inteiro positivo",
      });
    }

    if (ativa !== undefined && typeof ativa !== "boolean") {
      return res.status(400).json({
        success: false,
        message: "ativa deve ser um booleano",
      });
    }

    const question = await questionService.createQuestion({
      enunciado: enunciado.trim(),
      dificuldade,
      respostaCorreta,
      subjectId,
      authorId,
      ativa: ativa ?? true,
    });

    return res.status(201).json({
      success: true,
      data: question,
    });
  } catch (error) {
    if (error.code === "SUBJECT_NOT_FOUND") {
      return res.status(404).json({
        success: false,
        message: "Matéria não encontrada",
      });
    }

    if (error.code === "AUTHOR_NOT_FOUND") {
      return res.status(404).json({
        success: false,
        message: "Autor não encontrado",
      });
    }

    console.error("Erro ao criar questão:", error);

    return res.status(500).json({
      success: false,
      message: "Erro ao criar questão",
    });
  }
}

export async function getAll(req, res) {
  try {
    const questions = await questionService.getAllQuestions();

    return res.status(200).json({
      success: true,
      data: questions,
      total: questions.length,
    });
  } catch (error) {
    console.error("Erro ao buscar questões:", error);

    return res.status(500).json({
      success: false,
      message: "Erro ao buscar questões",
    });
  }
}

export async function getById(req, res) {
  try {
    const id = Number(req.params.id);

    if (!Number.isInteger(id) || id <= 0) {
      return res.status(400).json({
        success: false,
        message: "ID deve ser um número inteiro positivo",
      });
    }

    const question = await questionService.getQuestionById(id);

    if (!question) {
      return res.status(404).json({
        success: false,
        message: "Questão não encontrada",
      });
    }

    return res.status(200).json({
      success: true,
      data: question,
    });
  } catch (error) {
    console.error("Erro ao buscar questão:", error);

    return res.status(500).json({
      success: false,
      message: "Erro ao buscar questão",
    });
  }
}

export async function update(req, res) {
  try {
    const id = Number(req.params.id);

    if (!Number.isInteger(id) || id <= 0) {
      return res.status(400).json({
        success: false,
        message: "ID deve ser um número inteiro positivo",
      });
    }

    const {
      enunciado,
      dificuldade,
      respostaCorreta,
      subjectId,
      authorId,
      ativa,
    } = req.body;

    if (
      enunciado === undefined &&
      dificuldade === undefined &&
      respostaCorreta === undefined &&
      subjectId === undefined &&
      authorId === undefined &&
      ativa === undefined
    ) {
      return res.status(400).json({
        success: false,
        message: "Informe pelo menos um campo para atualizar",
      });
    }

    if (
      enunciado !== undefined &&
      (typeof enunciado !== "string" || enunciado.trim() === "")
    ) {
      return res.status(400).json({
        success: false,
        message: "enunciado deve ser um texto não vazio",
      });
    }

    if (
      dificuldade !== undefined &&
      (!Number.isInteger(dificuldade) || dificuldade < 1 || dificuldade > 3)
    ) {
      return res.status(400).json({
        success: false,
        message: "dificuldade deve ser 1, 2 ou 3",
      });
    }

    if (
      subjectId !== undefined &&
      (!Number.isInteger(subjectId) || subjectId <= 0)
    ) {
      return res.status(400).json({
        success: false,
        message: "subjectId deve ser um número inteiro positivo",
      });
    }

    if (
      authorId !== undefined &&
      (!Number.isInteger(authorId) || authorId <= 0)
    ) {
      return res.status(400).json({
        success: false,
        message: "authorId deve ser um número inteiro positivo",
      });
    }

    if (ativa !== undefined && typeof ativa !== "boolean") {
      return res.status(400).json({
        success: false,
        message: "ativa deve ser um booleano",
      });
    }

    if (
      respostaCorreta !== undefined &&
      respostaCorreta !== null &&
      typeof respostaCorreta !== "string"
    ) {
      return res.status(400).json({
        success: false,
        message: "respostaCorreta deve ser um texto ou null",
      });
    }

    const existingQuestion = await questionService.getQuestionById(id);

    if (!existingQuestion) {
      return res.status(404).json({
        success: false,
        message: "Questão não encontrada",
      });
    }

    const data = {};

    if (enunciado !== undefined) {
      data.enunciado = enunciado.trim();
    }

    if (dificuldade !== undefined) {
      data.dificuldade = dificuldade;
    }

    if (respostaCorreta !== undefined) {
      data.respostaCorreta = respostaCorreta;
    }

    if (subjectId !== undefined) {
      data.subjectId = subjectId;
    }

    if (authorId !== undefined) {
      data.authorId = authorId;
    }

    if (ativa !== undefined) {
      data.ativa = ativa;
    }

    const question = await questionService.updateQuestion(id, data);

    return res.status(200).json({
      success: true,
      data: question,
    });
  } catch (error) {
    if (error.code === "SUBJECT_NOT_FOUND") {
      return res.status(404).json({
        success: false,
        message: "Matéria não encontrada",
      });
    }

    if (error.code === "AUTHOR_NOT_FOUND") {
      return res.status(404).json({
        success: false,
        message: "Autor não encontrado",
      });
    }

    console.error("Erro ao atualizar questão:", error);

    return res.status(500).json({
      success: false,
      message: "Erro ao atualizar questão",
    });
  }
}

export async function remove(req, res) {
  try {
    const id = Number(req.params.id);

    if (!Number.isInteger(id) || id <= 0) {
      return res.status(400).json({
        success: false,
        message: "ID deve ser um número inteiro positivo",
      });
    }

    await questionService.deleteQuestion(id);

    return res.status(200).json({
      success: true,
      message: "Questão excluída com sucesso",
    });
  } catch (error) {
    if (error.code === "QUESTION_NOT_FOUND") {
      return res.status(404).json({
        success: false,
        message: "Questão não encontrada",
      });
    }

    console.error("Erro ao excluir questão:", error);

    return res.status(500).json({
      success: false,
      message: "Erro ao excluir questão",
    });
  }
}
