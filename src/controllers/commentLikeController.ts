import { Response, NextFunction } from "express";
import { AppDataSource } from "../index";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import { CommentLike } from "../entity/CommentLike";
import { verifyToken } from "../auth/bearerAuthorization";
dotenv.config();

export const commentLikePost = [
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
              //create commentLike instance
              const commentLike = CommentLike.create({
                is_liked,
                userId: authData.id,
                commentId: req.params.id,
              });
              //save commentLike in database
              try {
                await commentLike.save();
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

export const commentLikeDelete = [
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
              const commentLike = await AppDataSource.getRepository(CommentLike)
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
