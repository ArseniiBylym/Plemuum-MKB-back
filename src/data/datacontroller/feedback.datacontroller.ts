import Feedback from "../models/feedback.model";
import * as mongoose from "mongoose";
import { FeedbackModel, getDatabaseModel } from "../database/schema/feedback.schema";
import * as databaseManager from "../database/database.manager";
import { DatabaseManager } from "../database/database.manager";

let instance: FeedbackDataController;

export class FeedbackDataController {

    private databaseManager: DatabaseManager;

    constructor(databaseManager: DatabaseManager) {
        this.databaseManager = databaseManager;
    }
    public saveFeedback(feedback: Feedback): Promise<Feedback> {
        return new Promise((resolve, reject) => {
            const feedbackModel: mongoose.Model<FeedbackModel> = getDatabaseModel(this.databaseManager.getConnection());
            new feedbackModel(feedback).save((error: Error, feedback: Feedback) => {
                if (error) {
                    reject(error);
                } else {
                    resolve(feedback);
                }
            });
        });
    }
}

const controllerFactory = (databaseManager: DatabaseManager) => {
    if (instance) {
        return instance;
    } else {
        return new FeedbackDataController(databaseManager);
    }
}

export default controllerFactory;