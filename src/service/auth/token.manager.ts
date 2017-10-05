import { jwtOptions } from "../../../config/config";
import * as jwt from 'jsonwebtoken';

function generateNewToken(userId: string, isAdmin: boolean) {
    const payload = {
        id: userId,
        admin: isAdmin
    };
    return jwt.sign(payload, jwtOptions.secretOrKey, {expiresIn: getExpiryInSeconds(7)});
}

function generateNewTokensForResetPassword() {
    const tokenExpiry = new Date();
    const tokenExpired = new Date();

    tokenExpiry.setMinutes(tokenExpiry.getMinutes() + 60);
    tokenExpired.setDate(tokenExpired.getDate() - 1);

    return {tokenExpiry, tokenExpired}
}

function getExpiryAsDate(numberOfDays: number) {
    const expiry = new Date();
    expiry.setDate(expiry.getDate() + numberOfDays);
    return expiry;
}

function getExpiryInSeconds(numberOfDays: number) {
    return numberOfDays * 24 * 60 * 60
}

export { generateNewToken, generateNewTokensForResetPassword, getExpiryAsDate, getExpiryInSeconds }