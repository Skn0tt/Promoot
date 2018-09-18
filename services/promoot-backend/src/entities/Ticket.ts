import { Entity, PrimaryGeneratedColumn, Column, getRepository } from "typeorm";
import { Validation, Maybe } from "monet";
import { ITicket, isValidTicket } from "../models/Ticket";
import { getConfig } from "../config";
import { getMaxTickets } from "../redis";

const { ticketGroups } = getConfig();

@Entity()
export class Ticket implements ITicket {
  
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column()
  firstName: string;

  @Column()
  lastName: string;

  @Column()
  email: string;

  @Column()
  merchant: string;

  @Column()
  checkedIn: boolean;

  @Column({
    enum: ticketGroups,
    type: "enum"
  })
  ticketGroup: string;

}

const ticketRepo = () => getRepository(Ticket);

const fromUndefined = <T>(v: T | undefined): Maybe<T> => typeof v === "undefined" ? Maybe.None() : Maybe.Some(v!)

const ticketExists = async (firstName: string, lastName: string, email: string): Promise<boolean> => {
  const count = await ticketRepo()
    .createQueryBuilder("ticket")
    .where("LOWER(ticket.firstName) = LOWER(:firstName)", { firstName })
      .andWhere("LOWER(ticket.lastName) = LOWER(:lastName)", { lastName })
      .andWhere("LOWER(ticket.email) = LOWER(:email)", { email })
    .getCount();
  return count > 0;
}

export const areTicketsLeft = async () => {
  const maxTickets = await getMaxTickets();
  const currentAmount = await ticketRepo().count();

  return currentAmount < maxTickets;
}

export const createTicket = async (ticket: ITicket): Promise<Validation<string, Ticket>> => {
  if (!isValidTicket(ticket)) {
    return Validation.Fail("Ticket Invalid");
  }

  const { checkedIn, merchant, email, lastName, firstName } = ticket;

  if (!(await areTicketsLeft())) {
    return Validation.fail("No tickets left.");
  }

  if (await ticketExists(firstName, lastName, email)) {
    return Validation.Fail("Ticket already exists");
  }

  const result = new Ticket();

  result.checkedIn = checkedIn;
  result.merchant = merchant;
  result.email = email;
  result.lastName = lastName;
  result.firstName = firstName;

  await ticketRepo().save(result);

  return Validation.Success(result);
}

export const deleteTicket = async (id: string): Promise<Maybe<Ticket>> => {
  const ticket = await ticketRepo().findOne({ id });
  if (!ticket) {
    return Maybe.None();
  }

  await ticketRepo().delete(ticket);

  return Maybe.Some(ticket);
}

export const getTicket = async (id: string): Promise<Maybe<Ticket>> => {
  return fromUndefined(await ticketRepo().findOne({ id }));
}

export const getTickets = async (): Promise<Ticket[]> => {
  return await ticketRepo().find();
}

export const checkInTicket = async (id: string): Promise<Maybe<Ticket>> => {
  const ticket = await ticketRepo().findOne({ id });

  if (!ticket) {
    return Maybe.None();
  }

  ticket.checkedIn = true;

  await ticketRepo().save(ticket);

  return Maybe.Some(ticket);
}
