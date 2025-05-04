FROM node:23-alpine3.20

WORKDIR /app

COPY package.json .
COPY package-lock.json .

RUN npm ci --omit=dev && npm cache clean --force

COPY . .

EXPOSE 3000

CMD [ "node", "server.js" ]