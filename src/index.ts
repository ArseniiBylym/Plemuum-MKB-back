import app from './app'
import * as http from "http";
import config from '../config/config';
import {getDatabaseManager} from "./factory/database.factory";
import WorkerPlenuum from "./worker/compass.worker";
import * as ManagerFactory from "./factory/manager.factory";

const server: http.Server = http.createServer(app);

getDatabaseManager().openConnection(config.mongoUrl)
    .then(() => {
        server.listen(config.port);
        server.on("error", (error: Error) => {
            console.error(`Error starting  server ${error}`);
        });
        server.on("listening", () => {
            console.log(`Server started on port ${config.port}`);

            const organizationDataController: any = ManagerFactory.getOrganizationManager();
            const compassManager = ManagerFactory.getCompassManager();
            const worker = new WorkerPlenuum(config.workerTime, organizationDataController.organizationDataController, compassManager);
            worker.start();
        });
    })
    .catch(reason => console.error(reason));

// If the Node process ends, close the Mongoose connection
process.on('SIGINT', () => getDatabaseManager().closeConnection()
    .then(() => process.exit(0))
    .catch(() => process.exit(0)));