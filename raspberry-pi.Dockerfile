FROM arm32v7/node:8.4.0

WORKDIR /app

COPY package.json .

RUN npm install pm2 -g
RUN npm install

COPY . ./
RUN npm run generate-api-docs

CMD ["pm2","start","--no-daemon","process.json","--node-args=\"--max-old-space-size=1024\""]

