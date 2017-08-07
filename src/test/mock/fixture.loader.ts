import { getUserModel } from "../../data/database/schema/user.schema"
import { getFeedbackModel } from "../../data/database/schema/feedback.schema"
import { getRequestModel } from "../../data/database/schema/request.schema"
import * as DatabaseFactory from "../../factory/database.factory";
import Feedback from "../../data/models/feedback.model";
import * as fs from "fs";
import { User } from "../../data/models/user.model";
import * as ControllerFactory from '../../factory/controller.factory';

const testUser = {
    "firstName": "sheryl",
    "lastName": "grant",
    "email": "sheryl.grant@example.com",
    "password": "asd1234",
    "pictureUrl": "https://randomuser.me/api/portraits/women/85.jpg",
    "_id": "5984342227cd340363dc84af",
    "tokens": [],
    "orgIds": [
        "hipteam"
    ]
};

function fixtureLoader(): Promise<any> {
    let promises: Promise<any>[] = [];
    const userModel = getUserModel(DatabaseFactory.getDatabaseManager().getConnection());
    const feedbackModel = getFeedbackModel(DatabaseFactory.getDatabaseManager().getConnection(), 'hipteam');
    const requestModel = getRequestModel(DatabaseFactory.getDatabaseManager().getConnection(), 'hipteam');

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
    promises.push(new Promise((resolve, reject) => {
        requestModel.remove({}, () => {
            resolve();
        })
    }));

    return Promise.all(promises)
        .then(value => {
            const users = JSON.parse(fs.readFileSync('src/test/mock/json/users.json', 'utf8'));
            const feedbacks = JSON.parse(fs.readFileSync('src/test/mock/json/feedbacks.json', 'utf8'));
            const requests = JSON.parse(fs.readFileSync('src/test/mock/json/requests.json', 'utf8'));

            promises = [];

            users.forEach((user: User) => {
                promises.push(new userModel(user).save());
            });
            feedbacks.forEach((feedback: Feedback) => {
                promises.push(new feedbackModel(feedback).save());
            });
            requests.forEach((request: Request) => {
                promises.push(new requestModel(request).save());
            });
            return Promise.all(promises);
        })
}

/* Returns a token for tests */
function authenticate(testUser: any): Promise<string> {
    const sessionController = ControllerFactory.getSessionController();
    const request = {
        user: {_id: testUser._id},
        header: () => {
        },
    };
    const response: any = {
        send: () => {
        }
    };
    return sessionController.login(request, response, () => {
    });
}

export { fixtureLoader, authenticate, testUser }