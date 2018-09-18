import { Router, Request, Response } from "express";
import wrapAsync from "express-wrap-async";
import { getTickets, getTicket, checkInTicket, deleteTicket, createTicket } from "../entities/Ticket";
import basicAuth from "basic-auth";
import { isAdmin, getMerchant } from "../users";
import { isInCheckin } from "../checkIn";

export const tickets = Router();
export default tickets;

tickets.get("/", wrapAsync(async (req: Request, res: Response) => {
  const tickets = await getTickets();
  return res.status(200).json(tickets);
}));

tickets.get("/:ticketId", wrapAsync(async (req: Request, res: Response) => {
  const { ticketId } = req.params;
  const ticket = await getTicket(ticketId);
  if (ticket.isNone()) {
    return res.status(404).end();
  }
  return res.status(200).json(ticket.some());
}));

tickets.get("/:ticketId/checkIn", wrapAsync(async (req: Request, res: Response) => {
  if (!(await isInCheckin())) {
    return res.status(403).end("Not in Checkin");
  }
  
  const { ticketId } = req.params;
  const ticket = await checkInTicket(ticketId);
  if (ticket.isNone()) {
    return res.status(404).end();
  }
  return res.status(200).json(ticket.some());
}));

tickets.delete("/:ticketId", wrapAsync(async (req: Request, res: Response) => {
  if (!isAdmin(basicAuth(req))) {
    return res.status(403).end();
  }

  const { ticketId } = req.params;
  const ticket = await deleteTicket(ticketId);
  if (ticket.isNone()) {
    return res.status(404).end();
  }
  
  return res.status(200).json(ticket.some());
}));

tickets.post("/", wrapAsync(async (req: Request, res: Response) => {
  const merchant = getMerchant(basicAuth(req));
  if (merchant.isNone()) {
    return res.status(401).end();
  }

  const { body } = req;
  const createdTicket = await createTicket({
    checkedIn: false,
    email: body.email,
    firstName: body.firstName,
    lastName: body.lastName,
    merchant: merchant.some(),
    ticketGroup: body.ticketGroup,
  });
  
  if (createdTicket.isFail()) {
    return res.status(400).end(createdTicket.fail());
  }

  return res.status(201).json(createdTicket.success());
}));
