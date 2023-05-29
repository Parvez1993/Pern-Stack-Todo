import BadRequestError from "../errors/bad-request.js";
import prisma from "../client.js";
import { StatusCodes } from "http-status-codes";
import NotFoundError from "../errors/not-found.js";

const createTodo = async (req, res, next) => {
    const { description, status, deadline } = req.body;


    if (!description || !status || !deadline) {
        throw new BadRequestError("Please provide all the values");
    }

    const todolist = await prisma.todolist.create({
        data: {
            description,
            status,
            deadline,
            user_id: req.user.user_id,
        },
    });


    res.status(200).json({
        status: "success",
        todo: todolist,
    });

    // 3) If everything ok, send token to client


};

const getTodos = async (req, res, next) => {

    const {search,status,deadline} = req.query;
    console.log("searchhhhh", search)
    const users = await prisma.todolist.findMany({
        where: {
          description: {
            contains: search,
            mode: "insensitive"
          },
          status:status,
          deadline:deadline
        }
      });

    // 3) If everything ok, send token to client

    res.status(200).json({
        status: "success",
        todo: users,
    });


};


const getTodobyId = async (req, res, next) => {
    const todo = req.params.id;


    if (!todo) {
        throw new BadRequestError("No id is selected");
    }

    const user = await prisma.todolist.findUnique({
        where: {
            id: Number(todo)
        }
    });

    // 3) If everything ok, send token to client
    if (user) {
        res.status(200).json({
            status: "success",
            todo: user,
        });
    }else{
        throw new NotFoundError("No id is found");
    }
};


const deleteTodosById = async (req, res, next) => {
    const todo = req.params.id;


    if (!todo) {
        throw new BadRequestError("No id is selected");
    }

    const user = await prisma.todolist.delete({
        where: {
            id: Number(todo)
        }
    });

    // 3) If everything ok, send token to client
    res.status(200).json({
        status: "success",
        message: "successfully deleted"
    });

};


export {
    createTodo,
    getTodos,
    getTodobyId,
    deleteTodosById
};