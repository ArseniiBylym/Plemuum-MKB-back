import * as Util from "./util";
import { default as Feedback, PRIVACY, TYPE } from "../data/models/organization/feedback.model";
import { User } from "../data/models/common/user.model";

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
        password: "asd123",
        orgIds: ['hipteam'],
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

function getTestFeedback(): any {
    return {
        recipientId: '5984342227cd340363dc84aa',
        message: 'message',
        privacy: [PRIVACY.ANONYMOUS],
        type: Math.random() > .5 ? TYPE.CONSIDER : TYPE.CONTINUE,
        tags: []
    }
}

function getTestOrganization() {
    return {
        name: "TestOrg",
        dbName: "testorg",
        todoSentenceNumber: 3,
        compassGenerationTime: 3,
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

function getTestNotificationToken() {
    return {
        token: "02139712hsdad2190e12e129e12geh912e6gh19216912ge129eg1296"
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
    getTestGroup,
    getTestNotificationToken
}