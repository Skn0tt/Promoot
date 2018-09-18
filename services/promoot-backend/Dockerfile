FROM node:9
WORKDIR /app

COPY package.json ./package.json
COPY yarn.lock ./yarn.lock
COPY tsconfig.json ./tsconfig.json

RUN yarn install --frozen-lockfile

COPY ./src ./src

CMD yarn start
EXPOSE 3000