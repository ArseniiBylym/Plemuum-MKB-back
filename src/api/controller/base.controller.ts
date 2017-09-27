import { formError } from '../../util/errorhandler';
import * as StatusCodes from 'http-status-codes';

class BaseController {

    protected static getErrorStatus(err: any): number {
        return err.getStatusCode ? err.getStatusCode() : StatusCodes.INTERNAL_SERVER_ERROR
    }

    protected static handleError(error: any, res: any) {
        res.status(this.getErrorStatus(error)).send(formError(error))
    }
}

export default BaseController;