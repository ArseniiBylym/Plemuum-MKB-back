import app from './app'
import * as http from "http";
import config, { ENVIRONMENTS } from '../config/config';
import WorkerPlenuum from "./worker/compass.worker";
import * as ManagerFactory from "./factory/manager.factory";
import { getDatabaseManager } from "./factory/database.factory";
import * as cluster from 'cluster';

if (cluster.isMaster && config.env === ENVIRONMENTS.STAGING || config.env === ENVIRONMENTS.PRODUCTION) {
    // Count the machine's CPUs
    const cpuCount = require('os').cpus().length;

    // Create a worker for each CPU
    for (let i = 0; i < cpuCount; i += 1) {
        cluster.fork();
    }

    // Restart dead clusters
    cluster.on('exit', function (worker) {
        console.log('Worker %d died :(', worker.id);
        cluster.fork();
    });

// Code to run if we're in a worker process
} else {
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
}