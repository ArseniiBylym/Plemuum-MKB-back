import { expect, should } from 'chai';
import FeedbackController from "../../controller/feedback.controller";
import * as Sinon from "sinon";
import * as sinon from "sinon";
import FeedbackDataController from "../../data/datacontroller/feedback.datacontroller";

suite("FeedbackController unit tests", () => {

    let feedbackController: FeedbackController;
    let feedbackDataControllerStub: Sinon.SinonSpy;
    const mockRequest: any = {
        params: {
            userId: "userId",
            orgId: "orgId"
        }
    };
    const mockResult: any = {result: "result"};

    suite("getFeedbacks", () => {

        test("Happy case: test should getAllFeedback from FeedbackDataController then call res.json", done => {

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

        test("Sad case: test should getAllFeedback from FeedbackDataController then call res.json", done => {

            feedbackDataControllerStub = sinon.stub(FeedbackDataController, 'getAllFeedback')
                .returns(new Promise<any>((resolve, reject) => resolve(mockResult)));

            const mockResponse: any = {
                json: (error: any) => {
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

        test("Happy case: test should getSentFeedbacks from FeedbackDataController then call res.json", done => {

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

        test("Sad case: test should getSentFeedbacks from FeedbackDataController then call res.json", done => {

            feedbackDataControllerStub = sinon.stub(FeedbackDataController, 'getSentFeedbacks')
                .returns(new Promise<any>((resolve, reject) => resolve(mockResult)));

            const mockResponse: any = {
                json: (error: any) => {
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

        test("Happy case: test should getIncomingFeedbacks from FeedbackDataController then call res.json", done => {

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

        test("Sad case: test should getIncomingFeedbacks from FeedbackDataController then call res.json", done => {

            feedbackDataControllerStub = sinon.stub(FeedbackDataController, 'getIncomingFeedbacks')
                .returns(new Promise<any>((resolve, reject) => resolve(mockResult)));

            const mockResponse: any = {
                json: (error: any) => {
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

        test("Happy case: test should postFeedback from FeedbackDataController then call res.send", done => {

            feedbackDataControllerStub = sinon.stub(FeedbackDataController, 'saveFeedback')
                .returns(new Promise<any>((resolve, reject) => resolve(mockResult)));

            const mockRequest: any = {
                params: {
                    userId: "userId",
                    orgId: "hipteam"
                },
                body: {data: "data"}
            };

            const mockResponse: any = {
                send: (result: any) => {
                    should().equal(result, mockResult);
                    done();
                },
                status: (statusCode: number) => mockResponse
            };

            feedbackController = new FeedbackController();
            feedbackController.postFeedback(mockRequest, mockResponse);

            feedbackDataControllerStub.restore();
            expect(feedbackDataControllerStub.called).to.be.true;
        });

        test("Sad case: test should postFeedback from FeedbackDataController then call res.json", done => {

            feedbackDataControllerStub = sinon.stub(FeedbackDataController, 'saveFeedback')
                .returns(new Promise<any>((resolve, reject) => resolve(mockResult)));

            const mockResponse: any = {
                json: (result: any) => {
                    should().exist(result);
                    done();
                },
                status: (statusCode: number) => {
                    expect(statusCode).to.equal(400);
                    return mockResponse;
                }
            };

            feedbackController = new FeedbackController();
            feedbackController.postFeedback(mockRequest, mockResponse);

            feedbackDataControllerStub.restore();
            expect(feedbackDataControllerStub.called).to.be.true;
        });

        test("Sad case: instant error when body is empty", done => {

            feedbackDataControllerStub = sinon.stub(FeedbackDataController, 'saveFeedback')
                .returns(new Promise<any>((resolve, reject) => resolve(mockResult)));

            const emptyMockRequest: any = {
                body: undefined
            };

            const mockResponse: any = {
                json: (result: any) => {
                    expect(result).have.property("error");
                    done();
                },
                status: (statusCode: number) => {
                    expect(statusCode).to.equal(400);
                    return mockResponse;
                }
            };

            feedbackController = new FeedbackController();
            feedbackController.postFeedback(emptyMockRequest, mockResponse);

            feedbackDataControllerStub.restore();
            expect(feedbackDataControllerStub.called).to.be.true;
        })
    });
});