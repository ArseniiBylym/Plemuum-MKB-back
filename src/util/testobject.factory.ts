import { User } from "../data/models/user.model";
import * as Util from "./util";
import { default as Feedback } from "../data/models/feedback.model";

function getTestUser(firstName: string, lastName: string): any {
    return {
        firstName: firstName,
        lastName: lastName,
        email: `${firstName.toLowerCase()}.${lastName.toLowerCase()}${Util.getRandomInt(1, 1000)}@email.com`,
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

function getTestUserWithOrganizations(firstName: string, lastName: string, organizationIds: string[]): any {
    return {
        firstName: firstName,
        lastName: lastName,
        email: `${firstName.toLowerCase()}.${lastName.toLowerCase()}${Util.getRandomInt(1, 1000)}@email.com`,
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

function getTestGroup() {
    return {
        name: "Test Group",
        users: ["user1", "user2", "user3"],
        answerCardRelations: ["group1", "group2"],
        todoCardRelations: ["group3", "group4"],
        skills: ["skill1", "skill2"]
    }
}

export {
    getTestUser,
    getJohnDoe,
    getTestFeedback,
    getTestUserWithOrganizations,
    getRegisterTestUser,
    getRegisterJohnDoe,
    getTestOrganization,
    getTestGroup
}