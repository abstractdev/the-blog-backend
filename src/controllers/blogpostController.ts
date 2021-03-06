import { Response, NextFunction } from "express";
import { AppDataSource } from "../index";
import { In } from "typeorm";
import { body, validationResult } from "express-validator";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import { Blogpost } from "../entity/Blogpost";
import { verifyToken } from "../auth/Authorization";
import { Category } from "../entity/Category";
dotenv.config();

export const blogpostGet = (req: any, res: Response, next: NextFunction) => {
  try {
    //query database
    (async () => {
      const blogpost = await AppDataSource.getRepository(Blogpost)
        .createQueryBuilder("blogpost")
        .leftJoinAndSelect("blogpost.categories", "categories")
        .leftJoinAndSelect("blogpost.comments", "comments")
        .leftJoinAndSelect("blogpost.blogpost_likes", "blogpost_likes")
        .leftJoin("blogpost.user", "user")
        .addSelect(["user.first_name", "user.last_name", "user.username"])
        .getMany();
      res.json(blogpost);
    })();
  } catch (error) {
    res.sendStatus(400);
  }
};
export const singleBlogpostGet = (
  req: any,
  res: Response,
  next: NextFunction
) => {
  try {
    //query database
    (async () => {
      const blogpost = await AppDataSource.getRepository(Blogpost)
        .createQueryBuilder("blogpost")
        .leftJoinAndSelect("blogpost.categories", "categories")
        .leftJoinAndSelect("blogpost.comments", "comments")
        .leftJoinAndSelect("blogpost.blogpost_likes", "blogpost_likes")
        .leftJoin("blogpost.user", "user")
        .addSelect(["user.first_name", "user.last_name", "user.username"])
        .where("title = :title", { title: req.params.title })
        .getOne();
      res.json(blogpost);
    })();
  } catch (error) {
    res.sendStatus(400);
  }
};

export const blogpostPost = [
  // Validate and sanitize fields.
  body("title")
    .trim()
    .isLength({ min: 1 })
    .withMessage("Title cannot be empty")
    .isLength({ max: 100 })
    .withMessage("Title cannot exceed 100 characters"),
  body("image_url")
    .trim()
    .isLength({ min: 1 })
    .withMessage("Image Url cannot be empty")
    .isLength({ max: 100 })
    .withMessage("Image Url cannot exceed 100 characters"),
  body("content")
    .trim()
    .isLength({ min: 1 })
    .withMessage("Content cannot be empty")
    .isLength({ max: 10000 })
    .withMessage("Content cannot exceed 10000 characters"),

  verifyToken,
  // Process any after validation and sanitization.
  (req: any, res: Response, next: NextFunction) => {
    // Extract validation errors and send if not empty.
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.json(errors);
      return;
    } else {
      jwt.verify(
        req.cookies.access_token,
        process.env.JWT_SECRET!,
        (err: any, authData: any) => {
          if (err || authData.role !== "author") {
            res.sendStatus(403);
          } else {
            const { title, image_url, content, categoryIds } = req.body;
            if (err) {
              res.json(err);
              return next(err);
            } else {
              (async () => {
                // query for categories
                const categories = await AppDataSource.getRepository(
                  Category
                ).find({
                  where: { id: In([...categoryIds]) },
                });
                // create blogpost instance
                const blogpost = Blogpost.create({
                  title,
                  image_url,
                  content,
                  user_id: authData.id,
                  categories,
                });
                //save blogpost in database
                try {
                  await blogpost.save();
                  res.sendStatus(201);
                  return next;
                } catch (err) {
                  if (err && err.code === "23505") {
                    res.json({ error: "Title already exists" });
                    return err;
                  }
                }
              })();
            }
          }
        }
      );
    }
  },
];

// blogpost PUT
export const blogpostPut = [
  // Validate and sanitize fields.
  body("title")
    .trim()
    .isLength({ max: 20 })
    .withMessage("Title cannot exceed 20 characters"),
  body("image_url")
    .trim()
    .isLength({ max: 100 })
    .withMessage("Image Url cannot exceed 100 characters"),
  body("content")
    .trim()
    .isLength({ max: 200 })
    .withMessage("Content cannot exceed 200 characters"),
  //verify token
  verifyToken,
  (req: any, res: Response, next: NextFunction) => {
    // Extract validation errors and send if not empty.
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.json(errors);
      return;
    } else {
      jwt.verify(
        req.cookies.access_token,
        process.env.JWT_SECRET!,
        (err: any, authData: any) => {
          if (err) {
            res.sendStatus(403);
          } else {
            try {
              console.log(req.params.id);
              (async () => {
                let { title, image_url, content, is_published } = req.body;
                const blogpostGet = await AppDataSource.getRepository(Blogpost)
                  .createQueryBuilder()
                  .where("id = :id", { id: req.params.id })
                  .getOne();
                if (!title) {
                  title = blogpostGet?.title;
                }
                if (!image_url) {
                  image_url = blogpostGet?.image_url;
                }
                if (!content) {
                  content = blogpostGet?.content;
                }
                const blogpostPut = await AppDataSource.getRepository(Blogpost)
                  .createQueryBuilder()
                  .update()
                  .set({
                    title,
                    image_url,
                    content,
                    is_published,
                  })
                  .where("id = :id", {
                    id: req.params.id,
                  })
                  .execute();
                res.sendStatus(200);
              })();
            } catch (error) {
              res.sendStatus(400);
            }
          }
        }
      );
    }
  },
];

// blogpost DELETE
export const blogpostDelete = [
  verifyToken,
  (req: any, res: Response, next: NextFunction) => {
    jwt.verify(
      req.cookies.access_token,
      process.env.JWT_SECRET!,
      (err: any, authData: any) => {
        if (err) {
          res.sendStatus(403);
        } else {
          try {
            (async () => {
              const blogpost = await AppDataSource.getRepository(Blogpost)
                .createQueryBuilder()
                .delete()
                .where("id = :id", { id: req.params.id })
                .execute();
              res.sendStatus(200);
            })();
          } catch (error) {
            res.sendStatus(400);
          }
        }
      }
    );
  },
];
