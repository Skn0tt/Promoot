import axios from "axios";
import { Ticket } from "./interfaces";

const baseUrl = document.location.origin + "/api"

export const getAllTickets = async (): Promise<Ticket[]> => {
  const tickets = await axios.get(baseUrl + "/tickets");
  return tickets.data;
}

export const deleteTicket = async (id: string, adminPassword: string): Promise<Ticket> => {
  const res = await axios.delete(
    baseUrl + "/tickets/" + id, {
      auth: {
        username: "admin",
        password: adminPassword
      }
    }
  );
  return res.data;
}

export const createTicket = async (ticket: Partial<Ticket>, merchant: string, password: string): Promise<Ticket> => {
  const res = await axios.post(baseUrl + "/tickets", ticket, {
    auth: {
      password,
      username: merchant
    }
  });
  return res.data;
}

export const isInCheckInPhase = async (password: string) => {
  const res = await axios.get(baseUrl + "/admin/checkInPhase", {
    auth: {
      username: "admin",
      password
    }
  });
  return res.data;
}

export const setCheckInPhase = async (value: boolean, password: string) => {
  const res = await axios.put(baseUrl + "/admin/checkInPhase", "" + value, {
    headers: {
      "Content-Type": "text/plain"
    },
    auth: {
      username: "admin",
      password
    }
  });
  return res.data;
}