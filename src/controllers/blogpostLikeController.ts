import { Response, NextFunction } from "express";
import { AppDataSource } from "../index";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import { BlogpostLike } from "../entity/BlogpostLike";
import { verifyToken } from "../auth/Authorization";
dotenv.config();

export const blogpostLikePost = [
  verifyToken,
  // Process any after validation and sanitization.
  (req: any, res: Response, next: NextFunction) => {
    // Extract validation errors and send if not empty.
    jwt.verify(
      req.cookies.access_token,
      process.env.JWT_SECRET!,
      (err: any, authData: any) => {
        if (err) {
          res.sendStatus(403);
        } else {
          (async () => {
            const blogpostLike = BlogpostLike.create({
              userId: authData.id,
              blogpostId: req.params.blogpostId,
              blogpost_title: req.body.blogpost_title,
            });
            //save blogpostLike in database
            try {
              (async () => {
                await blogpostLike.save();
                res.json({ is_liked: true });
                return next;
              })();
            } catch (err) {
              if (err) {
                res.json(err);
                return err;
              }
            }
          })();
        }
      }
    );
  },
];

export const blogpostLikeDelete = [
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
              const blogpostLike = await AppDataSource.getRepository(
                BlogpostLike
              )
                .createQueryBuilder()
                .delete()
                .from(BlogpostLike)
                .where("blogpostId = :blogpostId", {
                  blogpostId: req.params.blogpostId,
                })
                .andWhere("userId = :userId", {
                  userId: authData.id,
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
  },
];
