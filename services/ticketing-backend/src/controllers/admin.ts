import { Router, Request, Response } from "express";
import wrapAsync from "express-wrap-async";
import { isInCheckin, setCheckin } from "../checkIn";
import { isAdmin } from "../users";
import basicAuth from "basic-auth";

export const admin = Router();

admin.use((req, res, next) => {
  if (!isAdmin(basicAuth(req))) {
    return res.status(403).end();
  }

  return next();
})

admin.get("/checkIn", wrapAsync(async (req: Request, res: Response) => {
  return res.status(200).json(await isInCheckin());
}));

admin.put("/checkIn", wrapAsync(async (req: Request, res: Response) => {
  const value = req.body;
  await setCheckin(value === "true");
  return res.status(200).end();
}));
