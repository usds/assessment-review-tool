FROM node:12.16.2-alpine

WORKDIR /app

COPY package.json .
COPY package-lock.json .

RUN npm install

COPY . ./app

ENV PORT=9000
EXPOSE 9000

CMD ["npm", "start"]