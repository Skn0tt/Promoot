import { SCHOOL_NAMES, getConfig } from "../config";
import * as _ from "lodash";

const { ticketGroups } = getConfig();

export interface ITicket {
  firstName: string;
  lastName: string;
  email: string;
  school: string;
  checkedIn: boolean;
  ticketGroup: string;
}

const EMAIL_REGEX = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
const isValidEmail = (mail: string) => EMAIL_REGEX.test(mail);

const isValidTicketGroup = (s: string) => ticketGroups.indexOf(s) !== -1

const isValidSchool = (school: string) => _.includes(SCHOOL_NAMES, school)

export const isValidTicket = (ticket: ITicket) => {
  const { email, school, ticketGroup } = ticket;
  return isValidEmail(email) && isValidSchool(school) && isValidTicketGroup(ticketGroup);
}
