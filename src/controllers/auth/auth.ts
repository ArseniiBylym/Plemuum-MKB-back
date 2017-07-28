import { Express, Request, Response } from "express";

const init = (express: Express): void => {
    express.route('/login').get((req: Request, res: Response) => {
        res.json({ message: 'Login' })
    })
}

export { init };