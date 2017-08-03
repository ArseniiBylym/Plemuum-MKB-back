
import { Error } from 'mongoose';

const getFriendlyErrorFromMongooseError = (error: Error) => {
    return {
        errorName: error.name,
        message: error.message,
    }
};

export { getFriendlyErrorFromMongooseError };