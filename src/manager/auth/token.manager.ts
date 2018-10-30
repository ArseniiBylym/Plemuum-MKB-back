import { jwtOptions } from "../../../config/config";
import * as jwt from 'jsonwebtoken';
import { refreshTokenDataController } from "../../data/datacontroller/refreshToken.datacontroller";
import RefreshToken from "../../data/models/common/refreshToken.model";
import config from '../../../config/config';

function generateNewToken(userId: string, createdAt: Date, isAdmin = false) {
    const expDate = getAccessTokenExpiryInSeconds();
    const payload = {
        id: userId,
        admin: isAdmin,
        createdAt: createdAt,
        expiryDate: new Date(createdAt.getTime() + (expDate * 1000))
    };
    return jwt.sign(payload, jwtOptions.secretOrKey, {expiresIn: expDate});
}

function generateAndSaveNewRefreshToken(userId: string, accessToken: string, createdAt: Date) {
    const expDate = getRefreshTokenExpiryInSeconds();
    const randToken = require('rand-token');
    const uid = randToken.uid(256);
    const refreshTkn = {
        userId: userId,
        accessToken: accessToken,
        refreshToken: uid,
        expiryDate: new Date(createdAt.getTime() + (expDate * 1000))
    };
    refreshTokenDataController.createRefreshToken(refreshTkn);
    return uid;
}

async function checkRefreshToken(userId: string, accessToken: string, refreshToken : string) {
    return refreshTokenDataController.getRefreshTokenByToken(refreshToken).then((result: any) => {
        const token: RefreshToken = result;
        return token.userId == userId && token.accessToken == accessToken && token.expiryDate >= new Date();
    }).catch((err: any) => {
        return false;
    });
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

function getAccessTokenExpiryInSeconds() {
    return config.accessTokenExpiryInMins * 60;
}

function deleteRefreshToken(token: string) {
    return refreshTokenDataController.deleteRefreshToken(token);
}

function getRefreshTokenExpiryInSeconds() {
    return getExpiryInSeconds(config.refreshTokenExpiryInDays);
}

export { generateNewToken, generateNewTokensForResetPassword, getExpiryAsDate, generateAndSaveNewRefreshToken, checkRefreshToken, deleteRefreshToken }