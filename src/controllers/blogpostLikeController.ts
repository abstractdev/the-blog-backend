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
            const blogpostLikeGet = await AppDataSource.getRepository(
              BlogpostLike
            )
              .createQueryBuilder("blogpostLike")
              .where("blogpostLike.blogpostId = :blogpostId", {
                blogpostId: req.params.blogpostId,
              })
              .getOne();
            if (blogpostLikeGet?.userId !== authData.id) {
              const blogpostLike = BlogpostLike.create({
                is_liked: true,
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
            } else if (
              blogpostLikeGet?.userId === authData.id &&
              blogpostLikeGet?.is_liked
            ) {
              (async () => {
                const blogpostLikePut = await AppDataSource.getRepository(
                  BlogpostLike
                )
                  .createQueryBuilder()
                  .update()
                  .set({ is_liked: false })
                  .where("blogpostId = :blogpostId", {
                    blogpostId: req.params.blogpostId,
                  })
                  .execute();
                res.json({ is_liked: false });
              })();
            } else if (
              blogpostLikeGet?.userId === authData.id &&
              !blogpostLikeGet?.is_liked
            ) {
              (async () => {
                const blogpostLikeGet = await AppDataSource.getRepository(
                  BlogpostLike
                )
                  .createQueryBuilder()
                  .update()
                  .set({ is_liked: true })
                  .where("blogpostId = :blogpostId", {
                    blogpostId: req.params.blogpostId,
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
