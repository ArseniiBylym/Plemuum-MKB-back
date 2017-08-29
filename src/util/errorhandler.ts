import { Error } from 'mongoose';
import * as StatusCodes from 'http-status-codes';


export enum ErrorType {
    // noinspection JSUnusedGlobalSymbols
    VALIDATION = StatusCodes.BAD_REQUEST,
    NOT_FOUND = StatusCodes.NOT_FOUND,
    FORBIDDEN = StatusCodes.FORBIDDEN,
    NOT_IMPLEMENTED = StatusCodes.NOT_IMPLEMENTED
}

export class PlenuumError extends Error {

    private type: ErrorType;

    constructor(message: string, type: ErrorType) {
        super(message);
        this.type = type;
    }

    public getStatusCode(): number {
        return this.type
    }
}

const formError = (error: Error) => {
    return {
        error: error.message
    }
};

export { formError };