import { getUserModel } from "../../data/database/schema/user.schema"
import { getFeedbackModel } from "../../data/database/schema/feedback.schema"
import * as DatabaseFactory from "../../factory/database.factory";
import Feedback from "../../data/models/feedback.model";
import * as fs from "fs";
import { User } from "../../data/models/user.model";

function fixtureLoader(): Promise<any> {
    let promises: Promise<any>[] = [];
    const userModel = getUserModel(DatabaseFactory.getDatabaseManager().getConnection(), 'common');
    const feedbackModel = getFeedbackModel(DatabaseFactory.getDatabaseManager().getConnection(), 'hipteam');

    promises.push(new Promise((resolve, reject) => {
        userModel.remove({}, () => {
            resolve();
        })
    }));
    promises.push(new Promise((resolve, reject) => {
        feedbackModel.remove({}, () => {
            resolve();
        })
    }));

    return Promise.all(promises)
        .then(value => {
            const users = JSON.parse(fs.readFileSync('src/test/mock/json/users.json', 'utf8'));
            const feedbacks = JSON.parse(fs.readFileSync('src/test/mock/json/feedbacks.json', 'utf8'));

            promises = [];

            users.forEach((user: User) => {
                promises.push(new userModel(user).save());
            });
            feedbacks.forEach((feedback: Feedback) => {
                promises.push(new feedbackModel(feedback).save());
            });
            return Promise.all(promises);
        });
}

export { fixtureLoader }