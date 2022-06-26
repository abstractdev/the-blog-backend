import { createConnection } from "typeorm";
import express from "express";
import dotenv from "dotenv";
import indexRouter from "./routes/index";
import usersRouter from "./routes/user";
import blogpostRouter from "./routes/blogpost";
import commentRouter from "./routes/comment";
require("./auth/passport");
const app = express();
dotenv.config();

const connection = (async () => {
  try {
    //connect to database
    await createConnection();
    console.log("Connected to Postgres");
    //express middleware
    app.use(express.json());
    app.use(express.urlencoded({ extended: true }));
    app.use("/", indexRouter);
    app.use("/users", usersRouter);
    app.use("/blog", blogpostRouter);
    app.use("/comment", commentRouter);
    //init express server
    app.listen(process.env.PORT);
    console.log(`Listening on port ${process.env.PORT}`);
  } catch (error) {
    console.error(error);
    throw new Error("Unable to connect to db");
  }
})();
