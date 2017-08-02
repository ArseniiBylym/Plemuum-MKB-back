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

export { validateUser }