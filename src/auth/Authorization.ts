import { Response, NextFunction } from "express";

export function verifyToken(req: any, res: Response, next: NextFunction) {
  if (req.cookies.access_token) {
    next();
  } else if (!req.cookies.access_token && req.body.created_by) {
    next();
  } else {
    res.sendStatus(403);
    return;
  }
}
