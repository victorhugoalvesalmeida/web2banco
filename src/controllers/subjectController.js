import * as subjectService from "../services/subjectService.js";

export async function create(req, res) {
  try {
    const { nome, professorId, ativa } = req.body;

    if (!nome || !professorId) {
      return res.status(400).json({
        success: false,
        message: "Nome e professorId são obrigatórios",
      });
    }

    if (!Number.isInteger(professorId) || professorId <= 0) {
      return res.status(400).json({
        success: false,
        message: "professorId deve ser um número inteiro positivo",
      });
    }

    const subject = await subjectService.createSubject({
      nome,
      professorId,
      ativa: ativa ?? true,
    });

    return res.status(201).json({
      success: true,
      data: subject,
    });
  } catch (error) {
    if (error.code === "PROFESSOR_NOT_FOUND") {
      return res.status(404).json({
        success: false,
        message: "Professor não encontrado",
      });
    }

    if (error.code === "P2002") {
      return res.status(409).json({
        success: false,
        message: "Matéria já cadastrada",
      });
    }

    console.error("Erro ao criar matéria:", error);

    return res.status(500).json({
      success: false,
      message: "Erro ao criar matéria",
    });
  }
}

export async function getAll(req, res) {
  try {
    const subjects = await subjectService.getAllSubjects();

    return res.status(200).json({
      success: true,
      data: subjects,
      total: subjects.length,
    });
  } catch (error) {
    console.error("Erro ao buscar matérias:", error);

    return res.status(500).json({
      success: false,
      message: "Erro ao buscar matérias",
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

    const subject = await subjectService.getSubjectById(id);

    if (!subject) {
      return res.status(404).json({
        success: false,
        message: "Matéria não encontrada",
      });
    }

    return res.status(200).json({
      success: true,
      data: subject,
    });
  } catch (error) {
    console.error("Erro ao buscar matéria:", error);

    return res.status(500).json({
      success: false,
      message: "Erro ao buscar matéria",
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

    const { nome, professorId, ativa } = req.body;

    if (
      nome === undefined &&
      professorId === undefined &&
      ativa === undefined
    ) {
      return res.status(400).json({
        success: false,
        message: "Informe pelo menos um campo para atualizar",
      });
    }

    if (nome !== undefined && (!nome || typeof nome !== "string")) {
      return res.status(400).json({
        success: false,
        message: "nome deve ser um texto não vazio",
      });
    }

    if (
      professorId !== undefined &&
      (!Number.isInteger(professorId) || professorId <= 0)
    ) {
      return res.status(400).json({
        success: false,
        message: "professorId deve ser um número inteiro positivo",
      });
    }

    if (ativa !== undefined && typeof ativa !== "boolean") {
      return res.status(400).json({
        success: false,
        message: "ativa deve ser um booleano",
      });
    }

    const existingSubject = await subjectService.getSubjectById(id);

    if (!existingSubject) {
      return res.status(404).json({
        success: false,
        message: "Matéria não encontrada",
      });
    }

    const data = {};

    if (nome !== undefined) {
      data.nome = nome.trim();
    }

    if (professorId !== undefined) {
      data.professorId = professorId;
    }

    if (ativa !== undefined) {
      data.ativa = ativa;
    }

    if (data.nome !== undefined && data.nome.length === 0) {
      return res.status(400).json({
        success: false,
        message: "nome deve ser um texto não vazio",
      });
    }

    const subject = await subjectService.updateSubject(id, data);

    return res.status(200).json({
      success: true,
      data: subject,
    });
  } catch (error) {
    if (error.code === "PROFESSOR_NOT_FOUND") {
      return res.status(404).json({
        success: false,
        message: "Professor não encontrado",
      });
    }

    console.error("Erro ao atualizar matéria:", error);

    return res.status(500).json({
      success: false,
      message: "Erro ao atualizar matéria",
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

    await subjectService.deleteSubject(id);

    return res.status(200).json({
      success: true,
      message: "Matéria excluída com sucesso",
    });
  } catch (error) {
    if (error.code === "SUBJECT_NOT_FOUND") {
      return res.status(404).json({
        success: false,
        message: "Matéria não encontrada",
      });
    }

    if (error.code === "SUBJECT_IN_USE") {
      return res.status(409).json({
        success: false,
        message:
          "Não é possível excluir uma matéria que possui questões vinculadas",
      });
    }

    console.error("Erro ao excluir matéria:", error);

    return res.status(500).json({
      success: false,
      message: "Erro ao excluir matéria",
    });
  }
}
