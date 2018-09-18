import { Router } from "express";

export const status = Router();

status.get("/", (_, res) => {
  return res.status(200).end("OK");
});
