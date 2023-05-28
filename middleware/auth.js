
import jwt from "jsonwebtoken";
import UnAuthenticatedError from "../errors/unauthenicated.js";

const auth = async (req, res, next) => {
  // const headers = req.headers;
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer")) {
    throw new UnAuthenticatedError("Authentication Invalid");
  }

  const token = authHeader.split(" ")[1];
  const [header, payload, signature] = token.split('.');
  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    const { id } = payload;

    // attach the user request object
    // req.user = payload


    req.user = { user_id: id };

    next();
  } catch (error) {
    throw new UnAuthenticatedError("Authentication invalid");
  }
};

export default auth;