interface School {
  name: string;
  password: string;
}

interface Config {
  schools: School[];
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
  }
}

let config: Config | null;

export const getConfig = () => {
  if (!config) {
    const {
      SCHOOLS,
      MYSQL_USERNAME,
      MYSQL_PASSWORD,
      MYSQL_HOSTNAME,
      MYSQL_PORT,
      MYSQL_DATABASE,
      ADMIN_PASSWORD,
      ADMIN_USERNAME,
      REDIS_HOSTNAME,
      REDIS_PORT,
    } = process.env;

    config = {
      schools: JSON.parse(SCHOOLS!),
      redis: {
        hostname: REDIS_HOSTNAME!,
        port: +REDIS_PORT!
      },
      admin: {
        username: ADMIN_USERNAME!,
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

export const SCHOOL_NAMES = getConfig().schools.map(s => s.name)
