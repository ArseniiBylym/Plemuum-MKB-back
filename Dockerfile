FROM node:8.4.0

WORKDIR /app

COPY package.json .
RUN npm install

COPY . ./

CMD echo "Voila"
