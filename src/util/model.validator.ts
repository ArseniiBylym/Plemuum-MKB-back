import { expect } from 'chai';

function validateUser(user: any) {
    expect(user).have.property('_id');
    expect(user).have.property('firstName');
    expect(user).have.property('lastName');
    expect(user).have.property('email');
    expect(user).have.property('tokens');
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
    expect(error).have.property("errorName");
    expect(error).have.property("message");
}

function validateRequest(request: any) {
    expect(request).have.property("senderId");
    expect(request).have.property("recipientId");
    expect(request).have.property("requestMessage");
}

function validateLoginResponse(loginResponse: any) {
    expect(loginResponse).have.property("_id");
    expect(loginResponse).have.property("token");
    expect(loginResponse).have.property("token_expiry");
    expect(loginResponse).have.property("orgIds");
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
    expect(organizationResponse).to.haveOwnProperty("compasseGenerationTime");
}

export {
    validateUser,
    validateFeedback,
    validateError,
    validateRequest,
    validateLoginResponse,
    validateTagResponse,
    validateOrganization
}