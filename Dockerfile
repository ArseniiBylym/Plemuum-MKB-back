FROM node:8.4.0

WORKDIR /app-w
VOLUME /app/log

COPY . ./
RUN npm install && \
    npm run generate-api-docs && \
    tsc && \
    rm -rf /app && \
    mv ./dist /app && \
    cp config/firebase/*.json /app/config/firebase && \
    cp -r res media /app/ && \
    cp -r docs /app

CMD node index.js
