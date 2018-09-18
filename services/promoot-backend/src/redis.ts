import * as redis from "redis";
import { getConfig } from "./config";
import * as _ from "lodash";

const { redis: { hostname, port } } = getConfig();

const client = redis.createClient({
  host: hostname,
  port: port
});

const CHECKIN_KEY = "CHECKIN";
const MAX_TICKETS_KEY = "MAX_TICKETS";

const set = <T>(KEY: string) => (value: T) => new Promise((resolve, reject) => {
  client.set(KEY, JSON.stringify(value), err => {
    if (!!err) {
      reject(err);
    }
    resolve();
  });
});

const get = <T>(KEY: string) => () => new Promise<T>((resolve, reject) => {
  client.get(KEY, (err, value) => {
    if (!!err) {
      reject(err);
    }
    resolve(JSON.parse(value));
  });
});

export const setMaxTickets = set<number>(MAX_TICKETS_KEY)

export const getMaxTickets = get<number>(MAX_TICKETS_KEY)

export const setupRedis = () => {
  client.get(CHECKIN_KEY, async (err, val) => {
    if (_.isNull(val)) {
      await setCheckin(false);
    }
  })
  client.get(MAX_TICKETS_KEY, async (err, val) => {
    if (_.isNull(val)) {
      await setMaxTickets(100);
    }
  })
}

export const setCheckin = set<boolean>(CHECKIN_KEY)

export const isInCheckin = get<boolean>(CHECKIN_KEY)
