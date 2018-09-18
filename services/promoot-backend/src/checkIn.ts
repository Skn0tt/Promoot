import * as redis from "redis";
import { getConfig } from "./config";
import * as _ from "lodash";

const { redis: { hostname, port } } = getConfig();

const client = redis.createClient({
  host: hostname,
  port: port
});

const CHECKIN_KEY = "CHECKIN";

export const setupCheckin = () => {
  client.get(CHECKIN_KEY, async (err, val) => {
    if (_.isNull(val)) {
      await setCheckin(false);
    }
  })
}

export const setCheckin = (to: boolean) => new Promise((resolve, reject) => {
  client.set(CHECKIN_KEY, "" + to, err => {
    if (!!err) {
      reject(err);
    }
    resolve();
  });
});

export const isInCheckin = () => new Promise<boolean>((resolve, reject) => {
  client.get(CHECKIN_KEY, (err, value) => {
    if (!!err) {
      reject(err);
    }

    resolve(JSON.parse(value));
  })
});
