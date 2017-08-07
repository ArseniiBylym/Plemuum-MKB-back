import BaseController from "./base.controller";
import * as tokenManager from "../auth/token.manager";
import { TokenObject } from "../auth/token.manager";
import { Request, Response } from "express";
import { User } from "../data/models/user.model";
import { UserModel } from "../data/database/schema/user.schema";
import UserDataController from "../data/datacontroller/user.datacontroller";

export default class SessionController extends BaseController {

    private userDataController: UserDataController;

    constructor(userDataController: UserDataController) {
        super();
        this.userDataController = userDataController;
    }

    public login(req: any, res: Response, next: Function) {
        const tokenObj: TokenObject = tokenManager.generateNewTokenObject();
        this.userDataController.getUserByIdWithoutOrgId(req.user._id)
            .then((userToLog: User) =>
                this.userDataController.updateUserToken(
                    req.user._id,
                    tokenObj,
                    req.header('User-Agent')
                ))
            .then((updatedUser: UserModel) => {
                const currentToken: any = updatedUser.tokens.find((token) => token.token === tokenObj.token);
                res.send({
                    _id: updatedUser._id,
                    token: currentToken.token,
                    token_expiry: currentToken.token_expiry,
                    orgIds: updatedUser.orgIds
                });
            })
            .catch((err: any) => {
                res.send({error: err});
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