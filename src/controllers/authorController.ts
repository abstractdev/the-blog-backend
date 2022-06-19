import { Response, NextFunction } from "express";
import { getRepository } from "typeorm";
import bcrypt from "bcrypt";
import { body, validationResult } from "express-validator";
import passport from "passport";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import { Author } from "../entity/Author";
import { verifyToken } from "../auth/bearerAuthorization";
import { UserRole } from "../entity/User";
dotenv.config();

// author SIGNUP POST
export const authorSignUpPost = [
  // Validate and sanitize fields.
  body("first_name")
    .trim()
    .isLength({ min: 1 })
    .withMessage("First name cannot be empty")
    .isLength({ max: 20 })
    .withMessage("First name cannot exceed 20 characters"),
  body("last_name")
    .trim()
    .isLength({ min: 1 })
    .withMessage("Last name cannot be empty")
    .isLength({ max: 20 })
    .withMessage("Last name cannot exceed 20 characters"),
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
    //destructure body
    const { first_name, last_name, username, password } = req.body;

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
            //create author instance with hashed password
            const author = Author.create({
              first_name,
              last_name,
              username,
              password: hashedPassword,
              role: UserRole.AUTHOR,
            });
            //save author in database
            try {
              await author.save();
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
