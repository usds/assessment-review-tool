FROM node:16.20.2-alpine

WORKDIR /app

COPY package.json .
COPY package-lock.json .

RUN npm install

COPY . ./app

ENV PORT=9000
EXPOSE 9000

CMD ["npm", "start"]
