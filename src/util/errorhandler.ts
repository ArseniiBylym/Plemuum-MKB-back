
import { Error } from 'mongoose';

const formError = (error: Error) => {
    return {
        error: error.message
    }
};

export { formError };