import * as sinon from "sinon";
import { testUser } from "../mock/fixture.loader";

const getRequestObject = (isInputValid: boolean) => {
    return {
        params: {},
        body: {},
        user: testUser,
        checkBody: sinon.stub().returns({notEmpty: sinon.stub()}),
        getValidationResult: sinon.stub().returns({
            isEmpty: sinon.stub().returns(isInputValid),
            array: sinon.stub().returns([{hint: "hint"}])
        })
    }
};

export { getRequestObject }