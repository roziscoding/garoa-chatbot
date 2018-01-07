FROM node:8.9.1-alpine

RUN mkdir /usr/app

WORKDIR /usr/app

COPY . .

RUN npm install

CMD ["npm", "start"]