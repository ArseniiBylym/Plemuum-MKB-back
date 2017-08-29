import * as ErrorHandler from '../../util/errorhandler';
import { Response } from 'express';
import * as StatusCodes from 'http-status-codes';

class BaseController {
    protected callController(promise: Promise<any>, res: Response, successCode: number, errorCode: number) {
        promise
            .then((result) => res.status(successCode).send(result))
            .catch((error) => res.status(errorCode).json(ErrorHandler.formError(error)));
    }

    protected static send(res: any, code: number, response: any) {
        res.status(code);
        res.send(response);
    }

    protected static getErrorStatus(err: any): number {
        return err.getStatusCode ? err.getStatusCode() : StatusCodes.INTERNAL_SERVER_ERROR
    }
}

export default BaseController;