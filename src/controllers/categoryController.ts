import { Response, NextFunction } from "express";
import { getRepository } from "typeorm";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import { Category } from "../entity/Category";
import { verifyToken } from "../auth/bearerAuthorization";
dotenv.config();

export const categoryGet = (req: any, res: Response, next: NextFunction) => {
  try {
    //query database
    (async () => {
      const category = await getRepository(Category)
        .createQueryBuilder("category")
        .getMany();
      res.json(category);
    })();
  } catch (error) {
    console.error(error);
    res.sendStatus(400);
  }
};

export const categoryPost = [
  verifyToken,
  // Process any after validation and sanitization.
  (req: any, res: Response, next: NextFunction) => {
    jwt.verify(
      req.token,
      process.env.JWT_SECRET!,
      (err: any, authData: any) => {
        if (err || authData.role !== "author") {
          res.sendStatus(403);
        } else {
          const { name } = req.body;
          if (err) {
            res.json(err);
            return next(err);
          } else {
            (async () => {
              //create category instance
              const category = Category.create({
                name,
              });
              //save category in database
              try {
                await category.save();
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
  },
];

export const categoryDelete = [
  verifyToken,
  (req: any, res: Response, next: NextFunction) => {
    jwt.verify(
      req.token,
      process.env.JWT_SECRET!,
      (err: any, authData: any) => {
        if (err || authData.role !== "author") {
          res.sendStatus(403);
        } else {
          try {
            (async () => {
              const category = await getRepository(Category)
                .createQueryBuilder()
                .delete()
                .where("id = :id", { id: req.params.id })
                .execute();
              res.sendStatus(200);
            })();
          } catch (error) {
            console.log(error);
            res.sendStatus(400);
          }
        }
      }
    );
  },
];
