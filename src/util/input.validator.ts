import * as expressValidator from 'express-validator';
import * as StatusCodes from 'http-status-codes';

const validateCompassAnswer = (input: any): boolean => {
    return true;
};

const validator = () => {
    return expressValidator({
        errorFormatter: function (param, msg, value) {
            let namespace = param ? param.split('.') : []
                , root = namespace.shift()
                , formParam = root;

            while (namespace.length) {
                formParam += '[' + namespace.shift() + ']';
            }
            return {
                param: formParam,
                msg: msg,
                value: value
            };
        },
        customValidators: {
            validateCompassAnswer: validateCompassAnswer
        }
    })
};

const validate = async (req: any, res: any) => {
    const validationResults = await req.getValidationResult();
    if (!validationResults.isEmpty()) {
        res.status(StatusCodes.BAD_REQUEST);
        res.send({error: "Validation error", hint: validationResults.array()});
        return false;
    }
    return true;
};

export { validator, validate }