import * as statusCodes from "http-status-codes";

export default () => async (req: any, res: any, next: Function) => {
    if (req.user.admin) {
        next();
    } else {
        res.status(statusCodes.FORBIDDEN).send("Forbidden");
    }
}