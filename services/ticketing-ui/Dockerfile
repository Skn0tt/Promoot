FROM node:9 as build
WORKDIR /usr/src/app

COPY package.json yarn.lock ./

RUN yarn --frozen-lockfile

COPY src ./src

RUN yarn build

FROM skn0tt/nginx-spa

# Install Curl (for Healthcheck)
RUN apt-get update; apt-get -y install curl;

# Copy over static content
COPY --from=build /usr/src/app/dist /app/

HEALTHCHECK CMD curl --fail -A "healthcheck" http://localhost || exit 1
