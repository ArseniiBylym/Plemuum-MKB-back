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

function generateNewTokensForResetPassword() {
    const tokenExpiry = new Date();
    const tokenExpired = new Date();

    tokenExpiry.setMinutes(tokenExpiry.getMinutes() + 60);
    tokenExpired.setDate(tokenExpired.getDate() - 1);

    return {tokenExpiry, tokenExpired}
}

export { generateNewTokenObject, generateNewTokensForResetPassword,  TokenObject }