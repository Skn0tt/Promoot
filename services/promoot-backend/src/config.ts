interface Merchant {
  name: string;
  password: string;
}

interface Config {
  merchants: Merchant[];
  admin: {
    username: string;
    password: string;
  };
  mysql: {
    username: string;
    password: string;
    hostname: string;
    port: number;
    database: string;
  };
  redis: {
    hostname: string;
    port: number;
  };
  ticketGroups: string[];
}

let config: Config | null;

export const getConfig = () => {
  if (!config) {
    const {
      MERCHANT_NAMES,
      MERCHANT_PASSWORDS,
      MYSQL_USERNAME,
      MYSQL_PASSWORD,
      MYSQL_HOSTNAME,
      MYSQL_PORT,
      MYSQL_DATABASE,
      ADMIN_PASSWORD,
      REDIS_HOSTNAME,
      REDIS_PORT,
      TICKET_GROUPS
    } = process.env;

    const merchantNames = MERCHANT_NAMES.split(",");
    const merchantPasswords = MERCHANT_PASSWORDS.split(",");
    const ticketGroups = TICKET_GROUPS.split(",");

    const merchants = merchantNames.map((name, index) => ({ name, password: merchantPasswords[index] }));

    config = {
      merchants,
      ticketGroups,
      redis: {
        hostname: REDIS_HOSTNAME!,
        port: +REDIS_PORT!
      },
      admin: {
        username: "admin",
        password: ADMIN_PASSWORD!,
      },
      mysql: {
        username: MYSQL_USERNAME!,
        database: MYSQL_DATABASE!,
        hostname: MYSQL_HOSTNAME!,
        password: MYSQL_PASSWORD!,
        port: +MYSQL_PORT!
      }
    };
  }

  return config;
}

export const MERCHANT_NAMES = getConfig().merchants.map(s => s.name)
