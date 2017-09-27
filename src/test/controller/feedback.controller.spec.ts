import { expect, should } from 'chai';
import FeedbackController from "../../api/controller/feedback.controller";
import * as Sinon from "sinon";
import * as sinon from "sinon";
import FeedbackDataController from "../../data/datacontroller/feedback.datacontroller";
import { ErrorType, PlenuumError } from "../../util/errorhandler";
import { getRequestObject } from "../util/testutil";

suite("FeedbackController unit tests", () => {

    let feedbackController: FeedbackController;
    let feedbackDataControllerStub: Sinon.SinonSpy;

    const mockRequest: any = getRequestObject(true);
    mockRequest.params.orgId = "orgId";
    mockRequest.params.userId = "userId";

    const mockResult: any = {result: "result"};

    suite("getFeedbacks", () => {

        test("Happy case: test should getAllFeedback from FeedbackDataController then call res.send", done => {

            feedbackDataControllerStub = sinon.stub(FeedbackDataController, 'getAllFeedback')
                .returns(new Promise<any>((resolve, reject) => resolve(mockResult)));

            const mockResponse: any = {
                send: (result: any) => {
                    expect(result).to.be.equal(mockResult);
                    done();
                },
                status: (statusCode: number) => mockResponse
            };

            feedbackController = new FeedbackController();
            feedbackController.getFeedbacks(mockRequest, mockResponse);

            feedbackDataControllerStub.restore();
            expect(feedbackDataControllerStub.called).to.be.true;
        });

        test("Sad case: test should getAllFeedback from FeedbackDataController then call res.send", done => {

            feedbackDataControllerStub = sinon.stub(FeedbackDataController, 'getAllFeedback')
                .returns(Promise.resolve(mockResult));

            const mockResponse: any = {
                send: (error: any) => {
                    done();
                },
                status: (statusCode: number) => mockResponse
            };

            feedbackController = new FeedbackController();
            feedbackController.getFeedbacks(mockRequest, mockResponse);

            feedbackDataControllerStub.restore();
            expect(feedbackDataControllerStub.called).to.be.true;
        });

        after(done => {
            done();
        })

    });

    suite("getSentFeedbacks", () => {

        test("Happy case: test should getSentFeedbacks from FeedbackDataController then call res.send", done => {

            feedbackDataControllerStub = sinon.stub(FeedbackDataController, 'getSentFeedbacks')
                .returns(new Promise<any>((resolve, reject) => resolve(mockResult)));

            const mockResponse: any = {
                send: (result: any) => {
                    expect(result).to.be.equal(mockResult);
                    done();
                },
                status: (statusCode: number) => mockResponse
            };

            feedbackController = new FeedbackController();
            feedbackController.getSentFeedbacks(mockRequest, mockResponse);

            feedbackDataControllerStub.restore();
            expect(feedbackDataControllerStub.called).to.be.true;
        });

        test("Sad case: test should getSentFeedbacks from FeedbackDataController then call res.send", done => {

            feedbackDataControllerStub = sinon.stub(FeedbackDataController, 'getSentFeedbacks')
                .returns(new Promise<any>((resolve, reject) => resolve(mockResult)));

            const mockResponse: any = {
                send: (error: any) => {
                    done();
                },
                status: (statusCode: number) => mockResponse
            };

            feedbackController = new FeedbackController();
            feedbackController.getSentFeedbacks(mockRequest, mockResponse);

            feedbackDataControllerStub.restore();
            expect(feedbackDataControllerStub.called).to.be.true;
        })

    });

    suite("getIncomingFeedbacks", () => {

        test("Happy case: test should getIncomingFeedbacks from FeedbackDataController then call res.send", done => {

            feedbackDataControllerStub = sinon.stub(FeedbackDataController, 'getIncomingFeedbacks')
                .returns(new Promise<any>((resolve, reject) => resolve(mockResult)));

            const mockResponse: any = {
                send: (result: any) => {
                    expect(result).to.be.equal(mockResult);
                    done();
                },
                status: (statusCode: number) => mockResponse
            };

            feedbackController = new FeedbackController();
            feedbackController.getIncomingFeedbacks(mockRequest, mockResponse);

            feedbackDataControllerStub.restore();
            expect(feedbackDataControllerStub.called).to.be.true;
        });

        test("Sad case: test should getIncomingFeedbacks from FeedbackDataController then call res.send", done => {

            feedbackDataControllerStub = sinon.stub(FeedbackDataController, 'getIncomingFeedbacks')
                .returns(new Promise<any>((resolve, reject) => resolve(mockResult)));

            const mockResponse: any = {
                send: (error: any) => {
                    should().exist(error);
                    done();
                },
                status: (statusCode: number) => mockResponse
            };

            feedbackController = new FeedbackController();
            feedbackController.getIncomingFeedbacks(mockRequest, mockResponse);

            feedbackDataControllerStub.restore();
            expect(feedbackDataControllerStub.called).to.be.true;
        })

    });

    suite("postFeedback", () => {

        test("Happy case: test should postFeedback from FeedbackDataController then call res.send", async () => {
            feedbackDataControllerStub = sinon.stub(FeedbackDataController, 'saveFeedback').resolves(mockResult);

            mockRequest.body = {data: "data"};

            const mockResponse: any = {
                send: sinon.stub(),
                status: sinon.stub().callsFake(() => mockResponse)
            };

            feedbackController = new FeedbackController();
            await feedbackController.postFeedback(mockRequest, mockResponse);
            feedbackDataControllerStub.restore();

            sinon.assert.calledWith(mockResponse.status, 201);
            sinon.assert.calledWith(mockResponse.send, mockResult);
        });

        test("Sad case: test should postFeedback from FeedbackDataController then call res.send", async () => {

            feedbackDataControllerStub = sinon.stub(FeedbackDataController, 'saveFeedback')
                .rejects(new PlenuumError("Mock error", ErrorType.VALIDATION));

            const mockResponse: any = {
                send: sinon.stub(),
                status: sinon.stub().callsFake(() => mockResponse)
            };

            feedbackController = new FeedbackController();
            await feedbackController.postFeedback(mockRequest, mockResponse);
            feedbackDataControllerStub.restore();

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

            feedbackController = new FeedbackController();
            await feedbackController.postFeedback(mockRequest, mockResponse);

            sinon.assert.calledWith(mockResponse.status, 400);
            sinon.assert.calledWithMatch(mockResponse.send, sinon.match.has("error"));
        })
    });
});