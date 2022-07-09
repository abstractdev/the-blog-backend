import { Response, NextFunction } from "express";
import { AppDataSource } from "../index";
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
              console.log("not equal");
              const blogpostLike = BlogpostLike.create({
                is_liked: true,
                userId: authData.id,
                blogpostId: req.params.blogpostId,
              });
              //save blogpostLike in database
              try {
                async () => {
                  await blogpostLike.save();
                  res.sendStatus(201);
                  return next;
                };
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
                res.json({ is_liked: "updated to false" });
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
                res.json({ is_liked: "updated to true" });
              })();
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
      req.token,
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
