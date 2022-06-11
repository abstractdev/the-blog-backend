import { Request, Response, NextFunction } from "express";
import { getRepository } from "typeorm";
import { User } from "../entity/User";

// user GET
export async function userGet(req: Request, res: Response, next: NextFunction) {
  try {
    //query database
    const users = await getRepository(User)
      .createQueryBuilder("user")
      .getMany();
    return res.json(users);
  } catch (error) {
    console.error(error);
    throw new Error("Unable to connect to db");
  }
}
// user POST
export async function userPost(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    //destructure users req data
    const { username, password } = req.body;
    //create user instance
    const user = User.create({
      username,
      password,
    });
    await user.save();
    res.sendStatus(201);
  } catch (error) {
    console.error(error);
    res.sendStatus(400);
  }
}
// user PUT
export async function userPut(req: Request, res: Response, next: NextFunction) {
  //destructure users req data
  const { username, password } = req.body;
  try {
    const user = await getRepository(User)
      .createQueryBuilder()
      .update()
      .set({ username: username, password: password })
      .where("username = :username", { username: req.params.username })
      .execute();
    res.sendStatus(200);
  } catch (error) {
    console.error(error);
    res.sendStatus(400);
  }
}
// user DELETE
export async function userDelete(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const user = await getRepository(User)
      .createQueryBuilder()
      .delete()
      .where("username = :username", { username: req.params.username })
      .execute();
    res.sendStatus(200);
  } catch (error) {
    console.log(error);
    res.sendStatus(400);
  }
}
