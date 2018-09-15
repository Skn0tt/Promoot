import { SCHOOL_NAMES } from "../config";
import * as _ from "lodash";

export interface ITicket {
  firstName: string;
  lastName: string;
  email: string;
  school: string;
  checkedIn: boolean;
}

const EMAIL_REGEX = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
const isValidEmail = (mail: string) => EMAIL_REGEX.test(mail);

const isValidSchool = (school: string) => _.includes(SCHOOL_NAMES, school)

export const isValidTicket = (ticket: ITicket) => {
  const { email, school } = ticket;
  return isValidEmail(email) && isValidSchool(school);
}
