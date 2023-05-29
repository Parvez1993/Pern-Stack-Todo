import express from "express";
import { createTodo, deleteTodosById, getTodobyId, getTodos } from "../controller/todoController.js";
import auth from "../middleware/auth.js"


const todoRouter = express.Router();


todoRouter.route("/").get(auth,getTodos);
todoRouter.route("/create").post(auth,createTodo);
todoRouter.route("/:id").get(auth,getTodobyId);
todoRouter.route("/:id").delete(auth,deleteTodosById);

export default todoRouter;