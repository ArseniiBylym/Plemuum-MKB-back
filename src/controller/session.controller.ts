import BaseController from "./base.controller";
import * as crypto from 'crypto';
import { Request, Response } from "express";
import { User } from "../data/models/user.model";
import { getUserModel, UserModel } from "../data/database/schema/user.schema";
import { getDatabaseManager } from "../factory/database.factory";
import UserDataController from "../data/datacontroller/user.datacontroller";

export default class SessionController extends BaseController {

    private userDataController: UserDataController;

    constructor(userDataController: UserDataController) {
        super();
        this.userDataController = userDataController;
    }

    // TODO Refactor this
    public login(req: Request, res: Response, next: Function) {
        const device = (<any> req).device;
        const userAgent = req.header('User-Agent');
        const token = crypto.randomBytes(64).toString('hex');
        const token_expiry = new Date();
        token_expiry.setDate(token_expiry.getDate() + Number(7));

        const user = getUserModel(getDatabaseManager().getConnection());

        user.findOne(req.user._id).lean().exec((err: any, userToLog: User) => {
            if (err) {
                res.json({error: err});
            } else {
                const query = {
                    $push: {
                        tokens: {
                            userId: req.user._id,
                            token: token,
                            token_expiry: token_expiry,
                            issued_at: new Date(),
                            client_type: userAgent
                        }
                    }
                };
                user.findByIdAndUpdate(req.user._id, query, {"new": true}, (err: Error, updatedUser: UserModel) => {
                    if (err) {
                        res.json({error: err});
                    } else {
                        const tokens = updatedUser.tokens;
                        const currentToken: any = tokens.find((element) => element.token === token);
                        const result = {
                            _id: updatedUser._id,
                            token: currentToken.token,
                            token_expiry: currentToken.token_expiry,
                            orgIds: updatedUser.orgIds
                        };

                        (<any> req)._renewToken = currentToken;
                        res.json(result);
                    }
                });
            }
        });
    }

    // TODO Implement this
    public logout(req: Request, res: Response, next: Function) {
        res.send({})
    }

    // TODO Implement this
    public checkToken(req: Request, res: Response, next: Function) {
        res.send({})
    }
}