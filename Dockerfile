FROM node:lts
MAINTAINER Facundo Martin Gordillo <facundomgordillo@gmail.com>
WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

CMD ["npm", "run", "dev"]