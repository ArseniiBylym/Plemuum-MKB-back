import { User } from "../data/models/user.model";
import * as Util from "./util";
import { default as Feedback } from "../data/models/feedback.model";

function getTestUser(firstName: string, lastName: string): User {
    return {
        firstName: firstName,
        lastName: lastName,
        email: `${firstName.toLowerCase()}.${lastName.toLowerCase()}${Util.getRandomInt(1, 1000)}@email.com`,
        tokens: [],
        pictureUrl: "",
        orgIds: ['hipteam', 'other'],
        password: "asd123"
    };
}

function getRegisterTestUser(firstName: string, lastName: string) {
    return {
        firstName: firstName,
        lastName: lastName,
        email: `${firstName.toLowerCase()}.${lastName.toLowerCase()}${Util.getRandomInt(1, 1000)}@email.com`,
        pictureUrl: "",
        password: "asd123"
    };
}

function getTestUserWithOrganizations(firstName: string, lastName: string, organizationIds: string[]): User {
    return {
        firstName: firstName,
        lastName: lastName,
        email: `${firstName.toLowerCase()}.${lastName.toLowerCase()}${Util.getRandomInt(1, 1000)}@email.com`,
        tokens: [],
        pictureUrl: "",
        orgIds: organizationIds,
        password: "asd123"
    };
}

function getJohnDoe(): User {
    return getTestUser("John", "Doe");
}

function getRegisterJohnDoe() {
    return getRegisterTestUser("John", "Doe");
}

function getTestFeedback(): Feedback {
    return {
        senderId: 'senderId',
        recipientId: 'recipientId',
        context: 'context',
        message: 'message',
        creationDate: Date.now().toString(),
        privacy: ['ANONYMOUS'],
        type: Math.random() > .5 ? 'CONSIDER' : 'CONTINUE',
        requestId: '',
        tags: []
    }
}

function getTestOrganization() {
    return {
        name: "TestOrg",
        dbName: "testorg",
        todoSentenceNumber: 3,
        compasseGenerationTime: 3,
    }
}

export {
    getTestUser,
    getJohnDoe,
    getTestFeedback,
    getTestUserWithOrganizations,
    getRegisterTestUser,
    getRegisterJohnDoe,
    getTestOrganization
}