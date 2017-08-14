import * as crypto from 'crypto';

interface TokenObject {
    token: string;
    tokenExpiry: Date
}

function generateNewTokenObject(): TokenObject {
    const token = crypto.randomBytes(64).toString('hex');
    const tokenExpiry = new Date();
    tokenExpiry.setDate(tokenExpiry.getDate() + 7);
    return {
        token: token,
        tokenExpiry: tokenExpiry
    }
}

export { generateNewTokenObject, TokenObject }