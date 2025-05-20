FROM node:23

WORKDIR /app

COPY package.json .

RUN npm install

COPY . .

VOLUME ["app/node_modules/"]

CMD ["npm","run","start"]

