import { Response, NextFunction } from "express";
import { getRepository } from "typeorm";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import { BlogpostLike } from "../entity/BlogpostLike";
import { verifyToken } from "../auth/bearerAuthorization";
dotenv.config();

export const blogpostLikePost = [
  verifyToken,
  // Process any after validation and sanitization.
  (req: any, res: Response, next: NextFunction) => {
    // Extract validation errors and send if not empty.
    jwt.verify(
      req.token,
      process.env.JWT_SECRET!,
      (err: any, authData: any) => {
        if (err) {
          res.sendStatus(403);
        } else {
          const { is_liked } = req.body;
          if (err) {
            res.json(err);
            return next(err);
          } else {
            (async () => {
              //create blogpostLike instance
              const blogpostLike = BlogpostLike.create({
                is_liked,
                userId: authData.id,
                blogpostId: req.params.id,
              });
              //save blogpostLike in database
              try {
                await blogpostLike.save();
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
  },
];

export const blogpostLikeDelete = [
  verifyToken,
  (req: any, res: Response, next: NextFunction) => {
    jwt.verify(
      req.token,
      process.env.JWT_SECRET!,
      (err: any, authData: any) => {
        if (err) {
          res.sendStatus(403);
        } else {
          try {
            (async () => {
              const blogpostLike = await getRepository(BlogpostLike)
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
