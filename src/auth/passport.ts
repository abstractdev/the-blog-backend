import passport from "passport";
import { getRepository } from "typeorm";
import { User } from "../entity/User";
import bcrypt from "bcrypt";
const LocalStrategy = require("passport-local").Strategy;

passport.use(
  new LocalStrategy(async (username: string, password: string, done: any) => {
    try {
      const user = await getRepository(User)
        .createQueryBuilder("user")
        .where("username = :username", { username: username })
        .getOne();
      if (!user) {
        return done(null, false, { message: "Incorrect username" });
      } else {
        bcrypt.compare(password, user.password, (err, res) => {
          if (res) {
            // passwords match! log user in
            return done(null, JSON.stringify(user));
          } else {
            // passwords do not match!
            return done(null, false, { message: "Incorrect password" });
          }
        });
      }
    } catch (error) {
      done(error);
    }
  })
);
