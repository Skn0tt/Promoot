import { createConnection } from "typeorm";
import { getConfig } from "./config";
import { Ticket } from "./entities/Ticket";

export const setupDB = async () => {
  const { mysql } = getConfig();
  await createConnection({
    name: "default",
    type: "mysql",
    logging: "all",
    host: mysql.hostname,
    port: mysql.port,
    synchronize: true,
    username: mysql.username,
    password: mysql.password,
    database: mysql.database,
    entities: [ Ticket ]
  })
};