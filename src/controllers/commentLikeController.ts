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
            const commentLikeGet = await AppDataSource.getRepository(
              CommentLike
            )
              .createQueryBuilder("commentLike")
              .where("commentLike.commentId = :commentId", {
                commentId: req.params.commentId,
              })
              .getOne();
            if (commentLikeGet?.userId !== authData.id) {
              const commentLike = CommentLike.create({
                is_liked: true,
                userId: authData.id,
                commentId: req.params.commentId,
                comment_content: req.body.comment_content,
              });
              //save commentLike in database
              try {
                (async () => {
                  await commentLike.save();
                  res.json({ is_liked: true });
                  return next;
                })();
              } catch (err) {
                if (err) {
                  res.json(err);
                  return err;
                }
              }
            } else if (
              commentLikeGet?.userId === authData.id &&
              commentLikeGet?.is_liked
            ) {
              (async () => {
                const commentLikePut = await AppDataSource.getRepository(
                  CommentLike
                )
                  .createQueryBuilder()
                  .update()
                  .set({ is_liked: false })
                  .where("commentId = :commentId", {
                    commentId: req.params.commentId,
                  })
                  .execute();
                res.json({ is_liked: false });
              })();
            } else if (
              commentLikeGet?.userId === authData.id &&
              !commentLikeGet?.is_liked
            ) {
              (async () => {
                const commentLikeGet = await AppDataSource.getRepository(
                  CommentLike
                )
                  .createQueryBuilder()
                  .update()
                  .set({ is_liked: true })
                  .where("commentId = :commentId", {
                    commentId: req.params.commentId,
                  })
                  .execute();
                res.json({ is_liked: true });
              })();
            }
          })();
        }
      }
    );
  },
];
