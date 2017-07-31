
import DatabaseManager from "../data/database/database.manager";
import config from '../../config/config'

let databaseManagerInstance: DatabaseManager;

const getDatabaseManager = (): DatabaseManager => {
    if (!databaseManagerInstance) {
        databaseManagerInstance = new DatabaseManager(config.mongoUrl);
    }
    return databaseManagerInstance;
}

export { getDatabaseManager }