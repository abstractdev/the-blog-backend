import { Response, NextFunction } from "express";
import { AppDataSource } from "../index";
import { body, validationResult } from "express-validator";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import { Comment } from "../entity/Comment";
import { verifyToken } from "../auth/Authorization";
import { User } from "src/entity/User";
dotenv.config();

export const commentGet = (req: any, res: Response, next: NextFunction) => {
  try {
    //query database
    (async () => {
      const comment = await AppDataSource.getRepository(Comment)
        .createQueryBuilder("comment")
        .where("blogpost_id = :blogpost_id", {
          blogpost_id: req.params.blogpost_id,
        })
        .leftJoinAndSelect("comment.comment_likes", "comment_likes")
        .getMany();
      res.json(comment);
    })();
  } catch (error) {
    res.sendStatus(400);
  }
};

export const singleCommentGet = (req: any, res: Response, next: NextFunction) => {
  console.log('a')
  try {
    //query database
    (async () => {
      const comment = await AppDataSource.getRepository(Comment)
        .createQueryBuilder("comment")
        .where("comment.id = :id", { id: req.params.comment_id })
        .leftJoinAndSelect("comment.comment_likes", "comment_likes")
        .getOne();
        console.log(comment)
      res.json(comment);
    })();
  } catch (error) {
    res.sendStatus(400);
  }
};

export const commentPost = [
  // Validate and sanitize fields.
  body("content")
    .trim()
    .isLength({ min: 1 })
    .withMessage("Content cannot be empty")
    .isLength({ max: 1000 })
    .withMessage("Content cannot exceed 1000 characters"),
  body("created_by")
    .trim()
    .isLength({ max: 20 })
    .withMessage("Username cannot exceed 20 characters"),

  verifyToken,
  // Process any after validation and sanitization.
  (req: any, res: Response, next: NextFunction) => {
    const { content, created_by } = req.body;
    // Extract validation errors and send if not empty.
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.json(errors);
      return;
    } else if (created_by) {
      (async () => {
        //create comment instance
        const comment = Comment.create({
          content,
          created_by,
          blogpost_id: req.body.blogpost_id,
          user_id: "6dd227eb-6e98-448c-ab42-c5a990840b37",
        });
        //save comment in database
        try {
          await comment.save();
          res.sendStatus(201);
          return next;
        } catch (err) {
          if (err) {
            res.json(err);
            return err;
          }
        }
      })();
    } else {
      jwt.verify(
        req.cookies.access_token,
        process.env.JWT_SECRET!,
        (err: any, authData: any) => {
          if (err) {
            res.sendStatus(403);
          } else {
            if (err) {
              res.json(err);
              return next(err);
            } else {
              (async () => {
                //create comment instance
                const comment = Comment.create({
                  content,
                  created_by: authData.username,
                  blogpost_id: req.body.blogpost_id,
                  user_id: authData.id,
                });
                //save comment in database
                try {
                  await comment.save();
                  res.sendStatus(201);
                  return next;
                } catch (err) {
                  if (err) {
                    res.json(err);
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

// comment PUT
export const commentPut = [
  // Validate and sanitize fields.
  body("content")
    .trim()
    .isLength({ min: 1 })
    .withMessage("Content cannot be empty")
    .isLength({ max: 1000 })
    .withMessage("Content cannot exceed 1000 characters"),

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
          if (err) {
            res.sendStatus(403);
          } else {
            const { content } = req.body;
            if (err) {
              res.json(err);
              return next(err);
            } else {
              try {
                (async () => {
                  const comment = await AppDataSource.getRepository(Comment)
                    .createQueryBuilder()
                    .update()
                    .set({ content })
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
        }
      );
    }
  },
];

// comment DELETE
export const commentDelete = [
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
              const comment = await AppDataSource.getRepository(Comment)
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
