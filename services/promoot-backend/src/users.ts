import { getConfig } from "./config";
import { Maybe } from "monet";
import { BasicAuthResult } from "basic-auth";

const { merchants, admin } = getConfig();

export const getMerchant = ({ name, pass }: BasicAuthResult): Maybe<string> => {
  const merchant = merchants.find((s) => s.name === name);

  if (!merchant) {
    return Maybe.None();
  }

  if (merchant.password !== pass) {
    return Maybe.None();
  }

  return Maybe.Some(merchant.name);
}

export const isAdmin = ({ name, pass }: BasicAuthResult): boolean => {
  return admin.username === name && admin.password === pass;
}