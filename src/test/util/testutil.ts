import * as sinon from "sinon";

const getRequestObject = (isInputValid: boolean) => {
    return {
        params: {},
        body: {},
        checkBody: sinon.stub().returns({notEmpty: sinon.stub()}),
        getValidationResult: sinon.stub().returns({
            isEmpty: sinon.stub().returns(isInputValid),
            array: sinon.stub()
        })
    }
};

export { getRequestObject }