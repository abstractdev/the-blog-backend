import { Blogpost } from "./src/entity/Blogpost";
import { User } from "./src/entity/User";
import { Comment } from "./src/entity/Comment";
import { CommentLike } from "./src/entity/CommentLike";
import { BlogpostLike } from "./src/entity/BlogpostLike";
import { Category } from './src/entity/Category';
import dotenv from "dotenv";
dotenv.config();

module.exports = {
  type: "postgres",
  host: process.env.TYPEORM_HOST,
  port: 5432,
  username: process.env.TYPEORM_USERNAME,
  password: process.env.TYPEORM_PASSWORD,
  database: process.env.TYPEORM_DATABASE,
  synchronize: true,
  entities: [User, Blogpost, BlogpostLike, Comment, CommentLike, Category],
};
