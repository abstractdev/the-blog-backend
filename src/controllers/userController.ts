import { Response, NextFunction } from "express";
import { getRepository } from "typeorm";
import bcrypt from "bcrypt";
import { body, validationResult } from "express-validator";
import passport from "passport";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import { User } from "../entity/User";
import { verifyToken } from "../auth/bearerAuthorization";
dotenv.config();

// user GET
export const userGet = [
  verifyToken,
  (req: any, res: Response, next: NextFunction) => {
    jwt.verify(
      req.token,
      process.env.JWT_SECRET!,
      (err: any, authData: any) => {
        if (err) {
          console.log(err);
          res.sendStatus(403);
        } else {
          try {
            //query database
            (async () => {
              let user;
              user = await getRepository(User)
                .createQueryBuilder("user")
                .where("username = :username", { username: authData.username })
                .getOne();
              res.json(user);
            })();
          } catch (error) {
            console.error(error);
            res.sendStatus(400);
          }
        }
      }
    );
  },
];

// user SIGNUP POST
export const userSignUpPost = [
  // Validate and sanitize fields.
  body("username")
    .trim()
    .isLength({ min: 1 })
    .withMessage("Username cannot be empty")
    .isLength({ max: 20 })
    .withMessage("Username cannot exceed 20 characters"),
  body("password")
    .trim()
    .isLength({ min: 1 })
    .withMessage("Password cannot be empty")
    .isLength({ max: 200 })
    .withMessage("Password cannot exceed 200 characters"),
  body("first_name")
    .trim()
    .isLength({ max: 20 })
    .withMessage("First name cannot exceed 20 characters"),
  body("last_name")
    .trim()
    .isLength({ max: 20 })
    .withMessage("Last name cannot exceed 20 characters"),

  // Process any after validation and sanitization.
  (req: any, res: Response, next: NextFunction) => {
    //destructure body
    const { username, password, role } = req.body;

    // Extract validation errors and send if not empty.
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.json(errors);
      return;
    } else {
      bcrypt.hash(password, 10, (err, hashedPassword) => {
        if (err) {
          res.json(err);
          return next(err);
        } else {
          (async () => {
            //create user instance with hashed password
            const user = User.create({
              username,
              password: hashedPassword,
              role,
            });
            //save user in database
            try {
              await user.save();
              res.sendStatus(201);
              return next;
            } catch (err) {
              if (err && err.code === "23505") {
                res.json({ error: "Username already exists" });
                return err;
              }
            }
          })();
        }
      });
    }
  },
];
// user LOGIN POST
export const userLogInPost = [
  // Validate and sanitize fields.
  body("username")
    .trim()
    .isLength({ min: 1 })
    .withMessage("Username cannot be empty")
    .isLength({ max: 20 })
    .withMessage("Username cannot exceed 20 characters"),
  body("password")
    .trim()
    .isLength({ min: 1 })
    .withMessage("Password cannot be empty")
    .isLength({ max: 200 })
    .withMessage("Password cannot exceed 200 characters"),
  // Process any after validation and sanitization.
  (req: any, res: Response, next: NextFunction) => {
    // Extract validation errors and send if not empty.
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.json(errors);
      return;
    } else {
      passport.authenticate(
        "local",
        { session: false },
        (err, username, info) => {
          if (!username) {
            return res.status(400).json({
              message: "Incorrect Username",
              username: username,
            });
          }
          if (err) {
            return res.status(400);
          } else {
            req.login(username, { session: false }, (err: any) => {
              if (err) {
                res.status(400).json({
                  error: err,
                });
              } else {
                (async () => {
                  const user = await getRepository(User)
                    .createQueryBuilder("user")
                    .where("username = :username", {
                      username: req.body.username,
                    })
                    .getOne();
                  const token = jwt.sign(
                    {
                      username: user!.username,
                      role: user!.role,
                      id: user!.id,
                    },
                    process.env.JWT_SECRET!
                  );
                  return res.json(token);
                })();
              }
            });
          }
        }
      )(req, res, next);
    }
  },
];
// user PUT
export const userPut = [
  // Validate and sanitize fields.
  body("username")
    .trim()
    .isLength({ min: 1 })
    .withMessage("Username cannot be empty")
    .isLength({ max: 20 })
    .withMessage("Username cannot exceed 20 characters"),
  body("password")
    .trim()
    .isLength({ min: 1 })
    .withMessage("Password cannot be empty")
    .isLength({ max: 200 })
    .withMessage("Password cannot exceed 200 characters"),
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
        req.token,
        process.env.JWT_SECRET!,
        (err: any, authData: any) => {
          if (err) {
            res.sendStatus(403);
          } else {
            const { username, password } = req.body;
            const hashed = bcrypt.hash(password, 10, (err, hashedPassword) => {
              if (err) {
                res.json(err);
                return next(err);
              } else
                try {
                  (async () => {
                    const user = await getRepository(User)
                      .createQueryBuilder()
                      .update()
                      .set({ username: username, password: hashedPassword })
                      .where("username = :username", {
                        username: authData.username,
                      })
                      .execute();
                    res.sendStatus(200);
                  })();
                } catch (error) {
                  console.error(error);
                  res.sendStatus(400);
                }
            });
          }
        }
      );
    }
  },
];
// user DELETE
export const userDelete = [
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
              const user = await getRepository(User)
                .createQueryBuilder()
                .delete()
                .where("username = :username", { username: authData.username })
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
