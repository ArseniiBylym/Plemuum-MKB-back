import { formError } from '../../util/errorhandler';
import * as StatusCodes from 'http-status-codes';
import logger from "../../util/logger";

class BaseController {

    protected static getErrorStatus(err: any): number {
        return err.getStatusCode ? err.getStatusCode() : StatusCodes.INTERNAL_SERVER_ERROR
    }

    protected static handleError(error: any, req: any, res: any) {
        const statusCode = this.getErrorStatus(error);
        if (statusCode >= 500) {
            delete req.body.password;
            logger.error({
                error: error,
                userId: req.user ? req.user._id : "",
                requestParams: req.params,
                requestBody: req.body,
                timeStamp: new Date()
            });
        }
        res.status(statusCode).send(formError(error))
    }
}

export default BaseController;