import { expect } from 'chai';

function validateUser(user: any) {
    expect(user).have.property('_id');
    expect(user).have.property('firstName');
    expect(user).have.property('lastName');
    expect(user).have.property('email');
    expect(user).have.property('tokens');
    expect(user).have.property('pictureUrl');
    expect(user).have.property('orgIds');
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

export { validateUser, validateFeedback, validateError, validateRequest }