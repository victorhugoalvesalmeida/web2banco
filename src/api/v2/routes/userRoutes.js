import { Router } from "express";
import * as userController from "../controllers/userController.js";
import { validate } from "../../../middlewares/validate.js";
import { createUserV2Schema, updateUserV2Schema } from "../schemas/userSchema.js";
import uploadPhoto from "../../../config/multer.js";

const router = Router();

router.get("/", userController.list);
router.get("/:id", userController.getById);
router.post("/", uploadPhoto, validate(createUserV2Schema), userController.create);
router.patch("/:id", uploadPhoto, validate(updateUserV2Schema), userController.update);
router.delete("/:id", userController.remove);

export default router;