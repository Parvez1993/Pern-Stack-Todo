import { StatusCodes } from "http-status-codes";
import BadRequestError from "../errors/bad-request.js";
import bcrypt from "bcryptjs";
import UnAuthenticatedError from "../errors/unauthenicated.js";
import prisma from "../client.js";
import jwt from "jsonwebtoken";

const signToken = (user) => {
    console.log("iddddd",user.id)
    let id = user.id

    return jwt.sign({id}, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRES_IN,
    });
};

const createSendToken = async (user, statusCode, req, res) => {
    const token = signToken(user);
    const cookieOptions = {
        expires: new Date(Date.now() + parseInt(process.env.JWT_COOKIE_EXPIRES_IN) * 24 * 60 * 60 * 1000),
        httpOnly: true,
      };

      console.log("aaaaaaaaaaaaaaa", token)

    res.cookie("jwt", token, cookieOptions);
    // user.password = undefined;
    res.status(statusCode).json({
        status: "success",
        token,
        user,
    });
};


const correctPassword = async (candidatePassword, userPassword) => {
    return await bcrypt.compare(candidatePassword, userPassword);
};




const login = async (req, res, next) => {
    const { email, password } = req.body;

    // 1) Check if email and password exist
    if (!email || !password) {
        throw new BadRequestError("Please provide all the values");
    }
    // 2) Check if user exists && password is correct
    const user = await prisma.user.findUnique({
        where: {
            email: email
        },
      
    });

    if (!user || !(await correctPassword(password, user.password))) {
        throw new UnAuthenticatedError("Incorrect credentials");
    }

    // 3) If everything ok, send token to client

    createSendToken(user, StatusCodes.CREATED, req, res);
};





const register = async (req, res, next) => {
    const { first_name, last_name, password, email } = req.body;

    if (!first_name || !email || !password) {
        throw new BadRequestError("please provide all values");
    }
    const userAlreadyExists = await prisma.user.findUnique({
        where: {
            email: email
        },
        select: {
            password: true
        }
    });

    if (userAlreadyExists) {
        throw new BadRequestError("Email already in use");
    }
    let hash = await bcrypt.hash(password, 12)

    const user = await prisma.user.create({
        data: {
            first_name,
            last_name,
            email,
            password: hash,
        },
        select: {
            id: true,
            first_name: true,
            last_name: true,
            email: true,
            // Include other non-sensitive fields you need
          },
    });

    
    createSendToken(user, StatusCodes.CREATED, req, res);
};


export {
    login,
    register,
};