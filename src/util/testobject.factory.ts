import * as Util from "./util";
import { default as Feedback, PRIVACY, TYPE } from "../data/models/organization/feedback.model";
import { User } from "../data/models/common/user.model";

function getTestUser(firstName: string, lastName: string): any {
    return {
        _id: '5a84007831fdc409bc538209',
        lastActive: new Date(),
        firstName: firstName,
        lastName: lastName,
        email: `${firstName.toLowerCase()}.${lastName.toLowerCase()}${Util.getRandomInt(1, 1000)}@email.com`,
        pictureUrl: "",
        orgId: 'hipteam',
        password: "asd123",
        managerId: ""
    };
}

function getTestSurvey(): any {
    return {
        title: "Test survey title",
        description: "test description",
        "respondents": ["5984342227cd340363dc84c7"],
        "expiritDate": "2020-10-20 18:51:41.696",
        "questions":[{"type":"text", "text":"2+2?","required":true,"min":10,"max":0},{"type":"1-6" ,"text":"4+4?","required":false}]
    };
}

function getRegisterTestUser(firstName: string, lastName: string) {
    return {
        firstName: firstName,
        lastName: lastName,
        email: `${firstName.toLowerCase()}.${lastName.toLowerCase()}${Util.getRandomInt(1, 1000)}@email.com`,
        pictureUrl: "",
        password: "asd123",
        orgId: 'hipteam',
    };
}

function getTestUserWithOrganizations(firstName: string, lastName: string, organizationId: string): any {
    return {
        firstName: firstName,
        lastName: lastName,
        email: `${firstName.toLowerCase()}.${lastName.toLowerCase()}${Util.getRandomInt(1, 1000)}@email.com`,
        pictureUrl: "",
        orgId: organizationId,
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

function getTestAllSurveysTodo() {
    return [
        {
            "_id":"5b557a9d82b9a800d4e29951",
            "createdAt":"2018-07-25 11:05:05.927Z",
            "updatedAt":"2018-07-25 11:05:05.927Z",
            "survey":"5b531d15617b0c1fb0c73658",
            "respondent":"5984342227cd340363dc84ad",
            "isCompleted":false
        },
        {
            "_id":"5b557a9d82b9a800d4e29953",
            "createdAt":"2018-07-25 11:15:05.927Z",
            "updatedAt":"2018-07-25 11:15:05.927Z",
            "survey":"5b531d15617b0c1fb0c73659",
            "respondent":"5984342227cd340363dc84ad",
            "isCompleted":false
        }
    ]
}

function getTestSurveysAfterDate() {
    return [
        {
            "_id":"5b531d15617b0c1fb0c73658",
            "createdAt":"2018-07-25 11:05:05.927Z",
            "updatedAt":"2018-07-25 11:05:05.927Z",
            "title": "Survey 1"
        },
        {
            "_id":"5b531d15617b0c1fb0c73690",
            "createdAt":"2018-07-25 11:05:05.927Z",
            "updatedAt":"2018-07-25 11:05:05.927Z",
            "title": "Survey 3"
        },
    ]
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
    getTestNotificationToken,
    getTestAllSurveysTodo,
    getTestSurveysAfterDate,
    getTestSurvey
}