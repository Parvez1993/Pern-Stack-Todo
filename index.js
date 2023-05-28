import express from "express"
import "express-async-errors";
import cors from "cors"
import router from "./routes/authRoutes.js";
import notFoundMiddleware from "./middleware/notFoundMiddleware.js";
import errorHandlerMiddleware from "./middleware/error-handler.js";
import pkg from 'pg';
import todoRouter from "./routes/todoRoutes.js";
const { Pool } = pkg;




const app = express()
app.use(cors())
app.use(express.json())


app.post("/todos", async(req,res)=>{
    try {
        console.log(req.body)
        const {description} = req.body;
        res.send(description)
    } catch (error) {

        
    }
})


app.use("/api/auth", router);
app.use("/api/todo", todoRouter);

app.use(notFoundMiddleware);
app.use(errorHandlerMiddleware);

//unhandled error

process.on("unhandledRejection", (err) => {
  console.log("UNHANDLED REJECTION! 💥 Shutting down...");
  console.log(err.name, err.message);
  server.close(() => {
    process.exit(1);
  });
});

process.on("uncaughtException", (err) => {
  console.log("UNCAUGHT EXCEPTION! 💥 Shutting down...");
  console.log(err.name, err.message);
  process.exit(1);
});

app.listen(4000,()=>{
console.log("i am connected")
})