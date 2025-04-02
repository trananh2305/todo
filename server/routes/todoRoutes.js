import express from "express";
import {
  createTodo,
  deleteTodo,
  getAllTodo,
  getTodoById,
  updateTodo,
} from "../controller/TodoController.js";

import { validatedToken } from "../middleware/validatedToken.js";

const router = express.Router();

router.use(validatedToken);

router.get("/get-all", getAllTodo);
router.get("/:id", getTodoById);
router.post("", createTodo);
router.patch("/update/:id", updateTodo);
router.patch("/delete/:id",deleteTodo)

export default router;
