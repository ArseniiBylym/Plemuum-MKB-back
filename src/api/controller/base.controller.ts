import { formError } from '../../util/errorhandler';
import * as StatusCodes from 'http-status-codes';
import logger from "../../util/logger";

class BaseController {

    protected getErrorStatus(err: any): number {
        return err.getStatusCode ? err.getStatusCode() : StatusCodes.INTERNAL_SERVER_ERROR
    }

    protected handleError(error: any, req: any, res: any) {
        const statusCode = this.getErrorStatus(error);
        if (statusCode >= 500) {
            delete req.body.password;
            logger.error({
                type: "error",
                request: {
                    cookies: req.cookies,
                    headers: req.headers,
                    params: req.params,
                    body: req.body,
                    user: req.user ? req.user : undefined,
                    url: req.url,
                    method: req.method
                },
                message: error,
                status: statusCode,
                timeStamp: new Date()
            });
        }
        res.status(statusCode).send(formError(error))
    }

    protected respond(status: number, request: any, response: any, message?: any) {
        delete request.body.password;
        response.status(status).send(message);
        try {
            logger.info({
                type: "info",
                request: {
                    cookies: request.cookies,
                    headers: request.headers,
                    params: request.params,
                    body: request.body,
                    user: request.user ? request.user : undefined,
                    url: request.url,
                    method: request.method
                },
                message: message,
                status: status,
                timestamp: new Date().toISOString()
            });
        } catch (err) {
            console.error(err);
        }
    }
}

export default BaseController;