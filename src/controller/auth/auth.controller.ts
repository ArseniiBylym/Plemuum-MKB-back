import { Express, Request, Response } from "express";

export default class AuthController {
    constructor() {
    }

    public register(express: Express) {
        express.route('/login').get((req: Request, res: Response) => {
            res.json({ message: 'Login' })
        });
    }
}