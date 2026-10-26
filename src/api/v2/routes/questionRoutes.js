import express from "express";
import * as questionController from "../controllers/questionController.js";
import validate from "../../../middlewares/validate.js";
import {
  createQuestionV2Schema,
  idParamSchema,
  updateQuestionV2Schema,
} from "../schemas/questionSchema.js";

const router = express.Router();

router.post("/", validate(createQuestionV2Schema), questionController.create);
router.get("/", questionController.getAll);
router.get(
  "/:id",
  validate(idParamSchema, "params"),
  questionController.getById,
);
router.patch(
  "/:id",
  validate(idParamSchema, "params"),
  validate(updateQuestionV2Schema),
  questionController.update,
);
router.delete(
  "/:id",
  validate(idParamSchema, "params"),
  questionController.remove,
);

export default router;
