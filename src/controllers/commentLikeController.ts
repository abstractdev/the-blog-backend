import { Response, NextFunction } from "express";
import { AppDataSource } from "../index";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import { CommentLike } from "../entity/CommentLike";
import { verifyToken } from "../auth/Authorization";
dotenv.config();

export const commentLikePost = [
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
            const commentLike = CommentLike.create({
              userId: authData.id,
              commentId: req.params.commentId,
              comment_content: req.body.comment_content,
              created_by: req.body.created_by,
            });
            //save commentLike in database
            try {
              await commentLike.save();
              res.json({ is_liked: true });
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
    );
  },
];

export const commentLikeDelete = [
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
              const commentLike = await AppDataSource.getRepository(CommentLike)
                .createQueryBuilder()
                .delete()
                .from(CommentLike)
                .where("commentId = :commentId", {
                  commentId: req.params.commentId,
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
