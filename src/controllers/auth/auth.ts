import {Express, Request, Response} from "express";

export class AuthController {

    constructor(express: Express) {
        AuthController.init(express);
    }

    private static init(express: Express) {
        express.route('/login').get((req: Request, res: Response) => {
            res.json({message: 'Login'})
        })
    }
}