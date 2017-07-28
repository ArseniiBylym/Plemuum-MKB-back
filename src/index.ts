import app from './App'
import * as http from "http";
import config from '../config/config';

const server: http.Server = http.createServer(app);

server.listen(config.port);
server.on("error", (error: Error) => {
    console.error(`Error starting  server ${error}`);
});
server.on("listening", () => {
    console.log(`Server started on port ${config.port}`);
});