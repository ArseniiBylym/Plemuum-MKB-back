import app from './App'
import * as http from "http";
import config from '../config/config';
import { getDatabaseManager } from "./factory/database.factory";

const server: http.Server = http.createServer(app);
getDatabaseManager().openConnection(config.mongoUrl)
    .then(() => {
        server.listen(config.port);
        server.on("error", (error: Error) => {
            console.error(`Error starting  server ${error}`);
        });
        server.on("listening", () => {
            console.log(`Server started on port ${config.port}`);
        });
    })
    .catch(reason => console.error(reason));

// If the Node process ends, close the Mongoose connection
process.on('SIGINT', () => getDatabaseManager().closeConnection()
    .then(() => process.exit(0))
    .catch(() => process.exit(0)));