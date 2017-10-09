import app from './app'
import * as http from "http";
import config from '../config/config';
import { getDatabaseManager } from "./factory/database.factory";
import OrganizationManager from "./api/manager/organization.manager";
import {getOrganizationDataController} from "./data/datacontroller/organization.datacontroller";
import WorkerPlenuum from "./worker/compass.worker";
import CompassManager from "./api/manager/compass.manager";
import {getGroupDataController} from "./data/datacontroller/group.datacontroller";

const server: http.Server = http.createServer(app);

getDatabaseManager().openConnection(config.mongoUrl)
    .then(() => {
        server.listen(config.port);
        server.on("error", (error: Error) => {
            console.error(`Error starting  server ${error}`);
        });
        server.on("listening", () => {
            console.log(`Server started on port ${config.port}`);


            const organizationDataController: any = new OrganizationManager(getOrganizationDataController());
            const compassManager = new CompassManager(getGroupDataController(), organizationDataController);
            const worker = new WorkerPlenuum(config.workerTime, organizationDataController.organizationDataController, compassManager);
            worker.start();
        });
    })
    .catch(reason => console.error(reason));

// If the Node process ends, close the Mongoose connection
process.on('SIGINT', () => getDatabaseManager().closeConnection()
    .then(() => process.exit(0))
    .catch(() => process.exit(0)));