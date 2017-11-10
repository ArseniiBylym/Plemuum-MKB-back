FROM node:8.4.0

WORKDIR /app
VOLUME /app/log

COPY package.json .

RUN npm install

COPY . ./
RUN npm run generate-api-docs

CMD npm start
