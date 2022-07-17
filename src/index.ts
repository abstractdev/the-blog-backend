import { DataSource } from "typeorm";
import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";
import indexRouter from "./routes/index";
import usersRouter from "./routes/user";
import blogpostRouter from "./routes/blogpost";
import commentRouter from "./routes/comment";
import commentLikeRouter from "./routes/commentLike";
import blogpostLikeRouter from "./routes/blogpostLike";
import categoryRouter from "./routes/category";
import { User } from "./entity/User";
import { Blogpost } from "./entity/Blogpost";
import { BlogpostLike } from "./entity/BlogpostLike";
import { CommentLike } from "./entity/CommentLike";
import { Category } from "./entity/Category";
import { Comment } from "./entity/Comment";
require("./auth/passport");
const app = express();
dotenv.config();

export const AppDataSource = new DataSource({
  type: "postgres",
  host: process.env.TYPEORM_HOST,
  port: 5432,
  username: process.env.TYPEORM_USERNAME,
  password: process.env.TYPEORM_PASSWORD,
  database: process.env.TYPEORM_DATABASE,
  synchronize: true,
  entities: [User, Blogpost, BlogpostLike, Comment, CommentLike, Category],
});
AppDataSource.initialize()
  .then(() => {
    console.log("Data Source has been initialized!");
  })
  .catch((err) => {
    console.error("Error during Data Source initialization", err);
  });

try {
  //express middleware
  app.use(cors({
    credentials: true,
    origin: "https://abstractdev.github.io"
  }));
  app.use(cookieParser());
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));
  app.use("/", indexRouter);
  app.use("/users", usersRouter);
  app.use("/blog", blogpostRouter);
  app.use("/comment", commentRouter);
  app.use("/commentLike", commentLikeRouter);
  app.use("/blogpostLike", blogpostLikeRouter);
  app.use("/category", categoryRouter);
  //init express server
  app.listen(process.env.PORT);
  console.log("connected");
} catch (error) {
  throw new Error("Unable to connect to server");
}
