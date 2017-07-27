import {Express} from "express";
import {AuthController} from './auth/auth';

module.exports.set = (express: Express) => {
    new AuthController(express);
};