import { Express, Request, Response } from "express";

class AuthController {
    constructor() {
    }

    public register(express: Express) {
        express.route('/login').get((req: Request, res: Response) => {
            res.json({ message: 'Login' })
        });
    }
}

export default new AuthController();