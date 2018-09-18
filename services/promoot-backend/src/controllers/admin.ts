import { Router, Request, Response } from "express";
import wrapAsync from "express-wrap-async";
import { isInCheckin, setCheckin, setMaxTickets, getMaxTickets } from "../redis";
import { isAdmin } from "../users";
import basicAuth from "basic-auth";

export const admin = Router();

admin.use((req, res, next) => {
  if (!isAdmin(basicAuth(req))) {
    return res.status(403).end();
  }

  return next();
})

admin.get("/", wrapAsync(async (_, res: Response) => {
  const result = {
    isInCheckInPhase: await isInCheckin(),
    maxTickets: await getMaxTickets(),
  };

  return res.status(200).json(result);
}))

admin.get("/isInCheckInPhase", wrapAsync(async (_, res: Response) => {
  return res.status(200).json(await isInCheckin());
}));

admin.put("/isInCheckInPhase", wrapAsync(async (req: Request, res: Response) => {
  const { body } = req;
  const newValue = body === "true";
  await setCheckin(newValue);
  return res.status(200).end("" + newValue);
}));

admin.get("/maxTickets", wrapAsync(async (_, res: Response) => {
  return res.status(200).json(await getMaxTickets());
}));

admin.put("/maxTickets", wrapAsync(async (req: Request, res: Response) => {
  const value = +req.body;
  await setMaxTickets(value);
  return res.status(200).end("" + value);
}));
