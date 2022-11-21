FROM node:14.21.1-alpine

WORKDIR /app

COPY package.json .
COPY package-lock.json .

RUN npm install

COPY . ./app

ENV PORT=9000
EXPOSE 9000

CMD ["npm", "start"]