import { expect } from 'chai';

function validateUser(user: any) {
    expect(user).have.property('_id');
    expect(user).have.property('firstName');
    expect(user).have.property('lastName');
    expect(user).have.property('email');
    expect(user).not.have.property('token');
    expect(user).have.property('pictureUrl');
    expect(user).have.property('orgIds');
    expect(user).not.have.property('password');
}

function validateFeedback(feedback: any) {
    expect(feedback).have.property("senderId");
    expect(feedback).have.property("recipientId");
    expect(feedback).have.property("context");
    expect(feedback).have.property("message");
    expect(feedback).have.property("privacy");
    expect(feedback).have.property("type");
    expect(feedback).have.property("requestId");
    expect(feedback).have.property("tags");
}

function validateError(error: any) {
    expect(error).have.property("error");
}

function validateRequest(request: any) {
    expect(request).have.property("senderId");
    expect(request).have.property("recipientId");
    expect(request).have.property("requestMessage");
}

function validateLoginResponse(loginResponse: any) {
    expect(loginResponse).have.property("token");
    expect(loginResponse).have.property("token_expiry");
}

function validateTagResponse(tagResponse: any) {
    expect(tagResponse).to.haveOwnProperty("title");
    expect(tagResponse).to.haveOwnProperty("isActive");
    expect(tagResponse).to.haveOwnProperty("order");
}

function validateOrganization(organizationResponse: any) {
    expect(organizationResponse).to.haveOwnProperty("_id");
    expect(organizationResponse).to.haveOwnProperty("name");
    expect(organizationResponse).to.haveOwnProperty("dbName");
    expect(organizationResponse).to.haveOwnProperty("todoSentenceNumber");
    expect(organizationResponse).to.haveOwnProperty("compassGenerationTime");
}

function validateGroup(group: any) {
    expect(group).to.haveOwnProperty('_id');
    expect(group).to.haveOwnProperty('name');
    expect(group).to.haveOwnProperty('users');
    expect(group).to.haveOwnProperty('skills');
    expect(group).to.haveOwnProperty('todoCardRelations');
    expect(group).to.haveOwnProperty('answerCardRelations');
    expect(group.users).to.be.an.instanceOf(Array);
    expect(group.skills).to.be.an.instanceOf(Array);
    expect(group.todoCardRelations).to.be.an.instanceOf(Array);
    expect(group.answerCardRelations).to.be.an.instanceOf(Array);
}

function validateCompassTodo(result: any, todoSentenceNumber: number) {
    expect(result).to.haveOwnProperty("about");
    expect(result).to.haveOwnProperty("owner");
    expect(result).to.haveOwnProperty("questions");

    expect(result.questions).to.be.instanceof(Array);
    expect(result.questions).to.have.lengthOf(todoSentenceNumber);
    expect(result.questions[0]).to.haveOwnProperty("sentence");
    expect(result.questions[0]).to.haveOwnProperty("skill");
};

export {
    validateUser,
    validateFeedback,
    validateError,
    validateRequest,
    validateLoginResponse,
    validateTagResponse,
    validateOrganization,
    validateGroup,
    validateCompassTodo
}