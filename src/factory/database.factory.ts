import DatabaseManager from "../data/database/database.manager";
import config from '../../config/config';

let databaseManagerInstance: DatabaseManager;

const getDatabaseManager = (mongoUri?: string): DatabaseManager => {
    if (!databaseManagerInstance) {
        let muri = config.mongoUrl;
        if (typeof mongoUri === "string") {
            muri = mongoUri;
        }
        databaseManagerInstance = new DatabaseManager(muri);
    }
    return databaseManagerInstance;
};

export { getDatabaseManager }