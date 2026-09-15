import * as userService from "../services/userService.js";

export async function getAll(req, res) {
  try {
    const users = await userService.getAllUsers();

    return res.status(200).json({
      success: true,
      data: users,
      total: users.length,
    });
  } catch (error) {
    console.error("Erro ao buscar usuários:", error);

    return res.status(500).json({
      success: false,
      message: "Erro ao buscar usuários",
    });
  }
}

export async function getById(req, res) {
  try {
    const id = Number(req.params.id);

    if (!Number.isInteger(id) || id <= 0) {
      return res.status(400).json({
        success: false,
        message: "ID inválido",
      });
    }

    const user = await userService.getUserById(id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "Usuário não encontrado",
      });
    }

    return res.status(200).json({
      success: true,
      data: user,
    });
  } catch (error) {
    console.error("Erro ao buscar usuário:", error);

    return res.status(500).json({
      success: false,
      message: "Erro ao buscar usuário",
    });
  }
}

export async function create(req, res) {
  try {
    const { nome, email, papel, foto } = req.body;

    if (!nome || !email) {
      return res.status(400).json({
        success: false,
        message: "Nome e email são obrigatórios",
      });
    }

    const user = await userService.createUser({
      nome,
      email,
      papel,
      foto,
    });

    return res.status(201).json({
      success: true,
      data: user,
    });
  } catch (error) {
    console.error("Erro ao criar usuário:", error);

    if (error.code === "EMAIL_ALREADY_EXISTS" || error.code === "P2002") {
      return res.status(409).json({
        success: false,
        message: "Email já cadastrado",
      });
    }

    return res.status(500).json({
      success: false,
      message: "Erro ao criar usuário",
    });
  }
}

export async function update(req, res) {
  try {
    const id = Number(req.params.id);

    if (!Number.isInteger(id) || id <= 0) {
      return res.status(400).json({
        success: false,
        message: "ID inválido",
      });
    }

    const allowedFields = ["nome", "email", "foto", "papel"];

    const data = {};

    for (const field of allowedFields) {
      if (req.body[field] !== undefined) {
        data[field] = req.body[field];
      }
    }

    if (Object.keys(data).length === 0) {
      return res.status(400).json({
        success: false,
        message: "Nenhum campo válido para atualização",
      });
    }

    if (data.nome !== undefined && !data.nome) {
      return res.status(400).json({
        success: false,
        message: "Nome não pode ser vazio",
      });
    }

    if (data.email !== undefined && !data.email) {
      return res.status(400).json({
        success: false,
        message: "Email não pode ser vazio",
      });
    }

    const existingUser = await userService.getUserById(id);

    if (!existingUser) {
      return res.status(404).json({
        success: false,
        message: "Usuário não encontrado",
      });
    }

    const user = await userService.updateUser(id, data);

    return res.status(200).json({
      success: true,
      data: user,
    });
  } catch (error) {
    console.error("Erro ao atualizar usuário:", error);

    if (error.code === "EMAIL_ALREADY_EXISTS" || error.code === "P2002") {
      return res.status(409).json({
        success: false,
        message: "Email já cadastrado",
      });
    }

    return res.status(500).json({
      success: false,
      message: "Erro ao atualizar usuário",
    });
  }
}

export async function remove(req, res) {
  try {
    const id = Number(req.params.id);

    if (!Number.isInteger(id) || id <= 0) {
      return res.status(400).json({
        success: false,
        message: "ID inválido",
      });
    }

    await userService.deleteUser(id);

    return res.status(200).json({
      success: true,
      message: "Usuário excluído com sucesso",
    });
  } catch (error) {
    console.error("Erro ao excluir usuário:", error);

    if (error.code === "USER_NOT_FOUND") {
      return res.status(404).json({
        success: false,
        message: "Usuário não encontrado",
      });
    }

    if (error.code === "USER_IN_USE" || error.code === "P2003") {
      return res.status(409).json({
        success: false,
        message: "Usuário possui registros vinculados",
      });
    }

    return res.status(500).json({
      success: false,
      message: "Erro ao excluir usuário",
    });
  }
}
