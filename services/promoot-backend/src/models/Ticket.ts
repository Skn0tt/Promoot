import { MERCHANT_NAMES, getConfig } from "../config";
import * as _ from "lodash";

const { ticketGroups } = getConfig();

export interface ITicket {
  firstName: string;
  lastName: string;
  email: string;
  merchant: string;
  checkedIn: boolean;
  ticketGroup: string;
}

const EMAIL_REGEX = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
const isValidEmail = (mail: string) => EMAIL_REGEX.test(mail);

const isValidTicketGroup = (s: string) => ticketGroups.indexOf(s) !== -1

const isValidMerchant = (merchant: string) => _.includes(MERCHANT_NAMES, merchant)

export const isValidTicket = (ticket: ITicket) => {
  const { email, merchant, ticketGroup } = ticket;
  return isValidEmail(email) && isValidMerchant(merchant) && isValidTicketGroup(ticketGroup);
}
