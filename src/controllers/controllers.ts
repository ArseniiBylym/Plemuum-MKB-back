import {Express, Request, Response} from "express";

const loginController = require('./auth');

module.exports.set = (express: Express) => {
    loginController.set(express);

    /* OTHER */
    express.route('/')
        .get((req: Request, res: Response) => {
            res.json({
                message: 'Hello World!'
            })
        })
};