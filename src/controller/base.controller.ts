import * as ErrorHandler from '../util/errorhandler';
import { Response } from 'express';

class BaseController {
    protected callController(promise: Promise<any>, res: Response, successCode: number, errorCode: number) {
        promise
            .then((result) => res.status(successCode).send(result))
            .catch((error) => res.status(errorCode).json(ErrorHandler.getFriendlyErrorFromMongooseError(error)));
    }
}

export default BaseController;