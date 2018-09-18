import { getConfig } from "./config";
import { Maybe } from "monet";
import { BasicAuthResult } from "basic-auth";

const { schools, admin } = getConfig();

export const getSchool = ({ name, pass }: BasicAuthResult): Maybe<string> => {
  const school = schools.find((s) => s.name === name);

  if (!school) {
    return Maybe.None();
  }

  if (school.password !== pass) {
    return Maybe.None();
  }

  return Maybe.Some(school.name);
}

export const isAdmin = ({ name, pass }: BasicAuthResult): boolean => {
  return admin.username === name && admin.password === pass;
}