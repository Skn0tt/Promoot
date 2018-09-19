import axios, { AxiosBasicCredentials } from "axios";
import { Ticket } from "./interfaces";

const baseUrl = document.location.origin + "/api"

export const getAllTickets = async () => {
  const tickets = await axios.get<Ticket[]>(baseUrl + "/tickets");
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

export const checkInTicket = async (id: string) => {
  const res = await axios.get<Ticket>(baseUrl + `/tickets/${id}/checkIn`);
  return res.data;
}

export const createTicket = async (ticket: Partial<Ticket>, merchant: string, password: string) => {
  const res = await axios.post<Ticket>(baseUrl + "/tickets", ticket, {
    auth: {
      password,
      username: merchant
    }
  });
  return res.data;
}

export const isInCheckInPhase = async (password: string) => {
  const res = await axios.get<boolean>(baseUrl + "/admin/checkInPhase", {
    auth: {
      username: "admin",
      password
    }
  });
  return res.data;
}

export const getAdminInfo = async (password: string) => {
  const res = await axios.get<
    { isInCheckInPhase: boolean, maxTickets: number }
    >(baseUrl + "/admin", {
      auth: {
        username: "admin",
        password
      }
    })

  return res.data;
}

export const getMaxTickets = async (password: string) => {
  const res = await axios.get<number>(baseUrl + "/admin/maxTickets", {
    auth: {
      username: "admin",
      password
    }
  })

  return res.data;
}

export const setMaxTickets = async (value: number, password: string) => {
  const res = await axios.put<number>(baseUrl + "/admin/maxTickets", value, {
    headers: {
      "Content-Type": "text/plain"
    },
    auth: {
      username: "admin",
      password
    }
  })

  return res.data;
}

export const setCheckInPhase = async (value: boolean, password: string) => {
  const res = await axios.put<boolean>(baseUrl + "/admin/checkInPhase", "" + value, {
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

export type Stats = { [merchant: string]: { [group: string]: { sold: number, checkedIn: number } } };

export const getStats = async () => {
  const res = await axios.get<Stats>(baseUrl + "/tickets/stats");

  return res.data;
}