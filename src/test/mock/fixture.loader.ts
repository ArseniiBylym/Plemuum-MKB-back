import { UserCollection } from "../../data/database/schema/user.schema"
import { FeedbackCollection } from "../../data/database/schema/feedback.schema"
import { RequestCollection } from "../../data/database/schema/request.schema"
import { TagCollection } from "../../data/database/schema/tag.schema"
import * as fs from "fs";
import * as ControllerFactory from '../../factory/controller.factory';
import { Model } from "mongoose";
import { OrganizationCollection } from "../../data/database/schema/organization.schema";

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
    let collections: any[] = [
        {model: UserCollection(), mockFile: 'users'},
        {model: FeedbackCollection('hipteam'), mockFile: 'feedbacks'},
        {model: RequestCollection('hipteam'), mockFile: 'requests'},
        {model: TagCollection('hipteam'), mockFile: 'tags'},
        {model: OrganizationCollection(), mockFile: "organizations"},
    ];

    /* Clear each collection */
    collections.forEach((collection) => promises.push(
        new Promise((resolve, reject) => collection.model.remove({}, () => resolve()))));

    return Promise.all(promises).then(() => {
        /* Read mock data from file and fill up the collections */
        collections.forEach((collection) => {
            if (collection.mockFile) {
                const mocks = JSON.parse(fs.readFileSync(`src/test/mock/json/${collection.mockFile}.json`, 'utf8'));
                mocks.forEach((mock: any) => promises.push(new collection.model(mock).save()));
            }
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