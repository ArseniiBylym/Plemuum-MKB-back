import app from './App'
import * as http from "http";

const port = process.env.PORT || 5000;
const server: http.Server = http.createServer(app);

server.listen(port);
server.on("error", (error: Error) => {
    console.error(`Error starting  server ${error}`);
});
server.on("listening", () => {
    console.log(`Server started on port ${port}`);
});