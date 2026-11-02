import * as userService from "../services/userService.js";

export async function list(req, res, next) {
  try {
    const users = await userService.listUsers();
    return res.status(200).json({ success: true, data: users });
  } catch (error) {
    return next(error);
  }
}

export async function getById(req, res, next) {
  try {
    const user = await userService.getUserById(req.params.id);
    return res.status(200).json({ success: true, data: user });
  } catch (error) {
    return next(error);
  }
}

export async function create(req, res, next) {
  try {
    const data = await userService.createUser(req.body, req.file);
    return res.status(201).json({ success: true, data });
  } catch (error) {
    return next(error);
  }
}

export async function update(req, res, next) {
  try {
    const data = await userService.updateUser(req.params.id, req.body, req.file);
    return res.status(200).json({ success: true, data });
  } catch (error) {
    return next(error);
  }
}

export async function remove(req, res, next) {
  try {
    await userService.deleteUser(req.params.id);
    return res.status(200).json({ success: true, data: null });
  } catch (error) {
    return next(error);
  }
}