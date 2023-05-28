import BadRequestError from "../errors/bad-request.js";
import prisma from "../client.js";
import { StatusCodes } from "http-status-codes";

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
        todo:todolist,
    });

    // 3) If everything ok, send token to client


};


export {
    createTodo
};