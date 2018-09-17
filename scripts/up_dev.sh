#!/usr/bin/env bash

touch docker-compose.out.yml
echo "" > docker-compose.out.yml
docker-app render > docker-compose.out.yml

docker-compose -f docker-compose.out.yml -f docker-compose.dev.yml up

rm docker-compose.out.yml
