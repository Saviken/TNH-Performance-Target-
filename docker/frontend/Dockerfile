FROM node:alpine

# Install git and bash
RUN apk update && apk add --no-cache git bash

WORKDIR /apps/frontend

COPY ./frontend .

RUN npm install

CMD [ "npm", "run", "deploy" ]