import FeedbackController from "../../api/controller/feedback.controller";
import * as sinon from "sinon";
import { ErrorType, PlenuumError } from "../../util/errorhandler";
import { getRequestObject } from "../util/testutil";

suite("FeedbackController unit tests", () => {

    const dummy: any = {};

    let feedbackController: FeedbackController;

    const mockRequest: any = getRequestObject(true);
    mockRequest.params.orgId = "orgId";

    const mockResult: any = {result: "result"};

    suite("getFeedbacks", () => {
        test("Happy case: test should getAllFeedback from FeedbackDataController then call res.send", async () => {
            const feedbackManager: any = {
                getFeedbacks: sinon.stub().resolves(mockResult)
            };

            const mockResponse: any = {
                send: sinon.stub(),
                status: sinon.stub().callsFake(() => mockResponse)
            };

            feedbackController = new FeedbackController(feedbackManager);
            await feedbackController.getFeedbacks(mockRequest, mockResponse);

            sinon.assert.calledWith(mockResponse.send, mockResult);
            sinon.assert.calledWith(mockResponse.status, 200);
        });

        test("Sad case: test should getAllFeedback from FeedbackDataController then call res.send", async () => {
            const feedbackManager: any = {
                getFeedbacks: sinon.stub().rejects(new PlenuumError("Mock error", ErrorType.NOT_ALLOWED))
            };

            const mockResponse: any = {
                send: sinon.stub(),
                status: sinon.stub().callsFake(() => mockResponse)
            };

            feedbackController = new FeedbackController(feedbackManager);
            await feedbackController.getFeedbacks(mockRequest, mockResponse);

            sinon.assert.calledWithMatch(mockResponse.send, sinon.match.has("error"));
            sinon.assert.calledWith(mockResponse.status, 405);
        });
    });

    suite("getSentFeedbacks", () => {
        test("Happy case: test should getSentFeedbacks from FeedbackDataController then call res.send", async () => {
            const feedbackManager: any = {
                getSentFeedbacks: sinon.stub().resolves(mockResult)
            };

            const mockResponse: any = {
                send: sinon.stub(),
                status: sinon.stub().callsFake(() => mockResponse)
            };

            feedbackController = new FeedbackController(feedbackManager);
            await feedbackController.getSentFeedbacks(mockRequest, mockResponse);

            sinon.assert.calledWith(mockResponse.send, mockResult);
            sinon.assert.calledWith(mockResponse.status, 200);
        });

        test("Sad case: test should getSentFeedbacks from FeedbackDataController then call res.send", async () => {
            const feedbackManager: any = {
                getSentFeedbacks: sinon.stub().rejects(new PlenuumError("Mock error", ErrorType.NOT_ALLOWED))
            };

            const mockResponse: any = {
                send: sinon.stub(),
                status: sinon.stub().callsFake(() => mockResponse)
            };

            feedbackController = new FeedbackController(feedbackManager);
            await feedbackController.getSentFeedbacks(mockRequest, mockResponse);

            sinon.assert.calledWithMatch(mockResponse.send, sinon.match.has("error"));
            sinon.assert.calledWith(mockResponse.status, 405);
        })
    });

    suite("getIncomingFeedbacks", () => {
        test("Happy case: test should getIncomingFeedbacks from FeedbackDataController then call res.send", async () => {
            const feedbackManager: any = {
                getIncomingFeedbacks: sinon.stub().resolves(mockResult)
            };

            const mockResponse: any = {
                send: sinon.stub(),
                status: sinon.stub().callsFake(() => mockResponse)
            };

            feedbackController = new FeedbackController(feedbackManager);
            await feedbackController.getIncomingFeedbacks(mockRequest, mockResponse);

            sinon.assert.calledWith(mockResponse.send, mockResult);
            sinon.assert.calledWith(mockResponse.status, 200);
        });

        test("Sad case: test should getIncomingFeedbacks from FeedbackDataController then call res.send", async () => {
            const feedbackManager: any = {
                getIncomingFeedbacks: sinon.stub().rejects(new PlenuumError("Mock error", ErrorType.NOT_ALLOWED))
            };

            const mockResponse: any = {
                send: sinon.stub(),
                status: sinon.stub().callsFake(() => mockResponse)
            };

            feedbackController = new FeedbackController(feedbackManager);
            await feedbackController.getIncomingFeedbacks(mockRequest, mockResponse);

            sinon.assert.calledWithMatch(mockResponse.send, sinon.match.has("error"));
            sinon.assert.calledWith(mockResponse.status, 405);
        })
    });

    suite("postFeedback", () => {
        test("Happy case: test should postFeedback from FeedbackDataController then call res.send", async () => {
            const feedbackManager: any = {
                postFeedback: sinon.stub().resolves(mockResult)
            };

            mockRequest.body = {data:"data",recipientId: "5984342227cd340363dc84aa"};

            const mockResponse: any = {
                send: sinon.stub(),
                status: sinon.stub().callsFake(() => mockResponse)
            };

            feedbackController = new FeedbackController(feedbackManager);
            await feedbackController.postFeedback(mockRequest, mockResponse);

            sinon.assert.calledWith(mockResponse.status, 201);
            sinon.assert.calledWith(mockResponse.send, mockResult);
        });

        test("Sad case: test should postFeedback from FeedbackDataController then call res.send", async () => {
            const feedbackManager: any = {
                postFeedback: sinon.stub().rejects(new PlenuumError("Mock error", ErrorType.VALIDATION))
            };

            const mockResponse: any = {
                send: sinon.stub(),
                status: sinon.stub().callsFake(() => mockResponse)
            };

            feedbackController = new FeedbackController(feedbackManager);
            await feedbackController.postFeedback(mockRequest, mockResponse);

            sinon.assert.calledWith(mockResponse.status, 400);
            sinon.assert.called(mockResponse.send);
        });

        test("Sad case: instant error when body is empty", async () => {
            mockRequest.getValidationResult = sinon.stub().returns({
                isEmpty: sinon.stub().returns(false),
                array: sinon.stub()
            });

            const mockResponse: any = {
                send: sinon.stub(),
                status: sinon.stub().callsFake(() => mockResponse)
            };

            feedbackController = new FeedbackController(dummy);
            await feedbackController.postFeedback(mockRequest, mockResponse);

            sinon.assert.calledWith(mockResponse.status, 400);
            sinon.assert.calledWithMatch(mockResponse.send, sinon.match.has("error"));
        })
    });
});