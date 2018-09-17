import { Some, Maybe, None } from "monet";
import cookie from "js-cookie";

type Config = {
  SCHOOL_NAMES: string[];
  TICKET_GROUPS: string[];
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
    SCHOOL_NAMES: c.SCHOOL_NAMES.split(";"),
    TICKET_GROUPS: ["5", "6"]
  };
};

export const get = () => {
  if (!config) {
    readConfig();
  }

  return config!;
};