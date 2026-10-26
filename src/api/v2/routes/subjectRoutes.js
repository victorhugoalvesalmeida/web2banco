import express from "express";
import * as subjectController from "../controllers/subjectController.js";
import validate from "../../../middlewares/validate.js";
import {
  createSubjectV2Schema,
  idParamSchema,
  updateSubjectV2Schema,
} from "../schemas/subjectSchema.js";

const router = express.Router();

router.post("/", validate(createSubjectV2Schema), subjectController.create);
router.get("/", subjectController.getAll);
router.get(
  "/:id",
  validate(idParamSchema, "params"),
  subjectController.getById,
);
router.patch(
  "/:id",
  validate(idParamSchema, "params"),
  validate(updateSubjectV2Schema),
  subjectController.update,
);
router.delete(
  "/:id",
  validate(idParamSchema, "params"),
  subjectController.remove,
);

export default router;
