import express from "express";
import { createTodo } from "../controller/todoController.js";
import auth from "../middleware/auth.js"


const todoRouter = express.Router();

todoRouter.route("/create").post(auth,createTodo);


export default todoRouter;