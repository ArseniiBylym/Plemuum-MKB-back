FROM node:8.4.0

WORKDIR /app

COPY . ./
RUN npm install

CMD echo "Voila"
