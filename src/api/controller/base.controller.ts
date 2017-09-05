import * as ErrorHandler from '../../util/errorhandler';
import { Response } from 'express';
import * as StatusCodes from 'http-status-codes';
import { formError } from "../../util/errorhandler";

class BaseController {

    protected static getErrorStatus(err: any): number {
        return err.getStatusCode ? err.getStatusCode() : StatusCodes.INTERNAL_SERVER_ERROR
    }

    protected static handleError(error: any, res: any) {
        res.status(this.getErrorStatus(error)).send(formError(error))
    }
}

export default BaseController;