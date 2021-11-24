FROM node:12.16.2 AS builder
RUN curl -o- -L https://yarnpkg.com/install.sh | bash

# set working directory

ENV WKDIR /opt/react_app
WORKDIR ${WKDIR}


# RUN npm install -g node-sass
RUN yarn global add react-scripts@3.4.1
RUN yarn global add serve

COPY package*.json .
COPY yarn.lock .

RUN yarn install --frozen-lockfile

ENV PATH ${WKDIR}/node_modules/.bin:$PATH


COPY . .

CMD ["yarn", "start"]