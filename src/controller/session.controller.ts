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

    public login(req: any, res: Response, next: Function): Promise<string> {
        const tokenObj: TokenObject = tokenManager.generateNewTokenObject();
        return UserDataController.getUserByIdWithoutOrgId(req.user._id)
            .then((userToLog: User) =>
                UserDataController.updateUserToken(
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
                return currentToken.token
            })
            .catch((err: any) => {
                res.send({error: err});
            });
    }

    public logout(req: any, res: Response, next: Function) {
        const authHeader = req.get('authorization');
        if (authHeader) {
            const token = authHeader.replace('bearer ', '');
            const tokens = req.user.tokens;
            const pastDate = new Date();
            pastDate.setDate(pastDate.getDate() - 30);
            const currentTokenIndex = tokens.findIndex((element: any) => {
                return element.token === token;
            });
            tokens[currentTokenIndex] = {
                ...tokens[currentTokenIndex],
                token_expiry: pastDate
            };

            this.userDataController.changeTokens(req.user._id, tokens)
                .then(result =>
                    res.send(result
                        ? {message: "User Logged out successfully!"}
                        : {message: "User could not be logged out. Try again!"})
                )
                .catch(err => res.status(404).json({error: "User not found"}));
        } else {
            res.status(400).send("Bad Request");
        }
    }

    public checkToken(req: Request, res: Response, next: Function) {
        this.userDataController.getResetToken(req.body.token)
            .then((resetToken) => {
                const now = new Date();
                let valid: Object = {validToken: true, reseted: false};
                if (resetToken.token_expiry < now || resetToken.reseted) {
                    valid = {validToken: false, reseted: resetToken.reseted};
                }
                res.send(valid);
            })
            .catch(reason => res.status(400).json({error: "Something went wrong!"}));
    }
}