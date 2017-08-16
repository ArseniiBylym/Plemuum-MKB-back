import DatabaseManager from "../data/database/database.manager";

let databaseManagerInstance: DatabaseManager;

const getDatabaseManager = (): DatabaseManager => {
    if (!databaseManagerInstance) {
        databaseManagerInstance = new DatabaseManager();
    }
    return databaseManagerInstance;
};

export { getDatabaseManager }