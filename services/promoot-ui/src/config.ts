import { Some, Maybe, None } from "monet";
import cookie from "js-cookie";

type Config = {
  MERCHANT_NAMES: string[];
  TICKET_GROUPS: string[];
  TITLE: string;
};

let config: Config | null = null;

const CONFIG_COOKIE = "_config";
const LOCAL_STORAGE_CONFIG_KEY = "CONFIG";

const getCookie = (key: string): Maybe<string> => {
  const c = cookie.get(key);
  if (!c) {
    return Maybe.None()
  }
  return Maybe.Some(c);
}

const getLocalstorage = (key: string): Maybe<string> => {
  const value = window.localStorage.getItem(key);
  return !!value ? Some(value) : None();
}

const getConfig = (): any => {
  const c = getCookie(CONFIG_COOKIE)
    .orElse(getLocalstorage(LOCAL_STORAGE_CONFIG_KEY))
    .orElse(Some("{}"))
    .some();

  window.localStorage.setItem(LOCAL_STORAGE_CONFIG_KEY, c);
  return JSON.parse(c);
};

const readConfig = () => {
  const c = getConfig();

  config = {
    MERCHANT_NAMES: c.MERCHANT_NAMES.split(":"),
    TICKET_GROUPS: c.TICKET_GROUPS.split(":"),
    TITLE: c.TITLE,
  };
};

export const get = () => {
  if (!config) {
    readConfig();
  }

  return config!;
};
