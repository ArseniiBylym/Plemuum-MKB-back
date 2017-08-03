import { expect, should } from 'chai';
import { anyString, anything, instance, mock, verify, when } from "ts-mockito";
import FeedbackDataController from "../../data/datacontroller/feedback.datacontroller";
import FeedbackController from "./feedback.controller";

suite("FeedbackController unit tests", () => {

    let feedbackController: FeedbackController;
    const mockRequest: any = {
        params: {
            userId: "userId"
        }
    };
    const feedbackDataController: FeedbackDataController = mock(FeedbackDataController);
    const mockResult: any = {result: "result"};

    suite("getFeedbacks", () => {

        test("Happy case: test should getAllFeedback from FeedbackDataController then call res.json", done => {

            when(feedbackDataController.getAllFeedback(anyString())).thenReturn(
                new Promise<any>((resolve, reject) => resolve(mockResult))
            );

            /* If done was called, then the test passed, otherwise timeout */
            const mockResponse: any = {
                send: (result: any) => {
                    expect(result).to.be.equal(mockResult);
                    done();
                },
                status: (statusCode: number) => mockResponse
            };

            feedbackController = new FeedbackController(instance(feedbackDataController));
            feedbackController.getFeedbacks(mockRequest, mockResponse);
            verify(feedbackDataController.getAllFeedback(anyString())).called();
        });

        test("Sad case: test should getAllFeedback from FeedbackDataController then call res.json", done => {

            when(feedbackDataController.getAllFeedback(anyString())).thenReturn(
                new Promise<any>((resolve, reject) => reject({}))
            );

            /* If done was called, then the test passed, otherwise timeout */
            const mockResponse: any = {
                json: (error: any) => {
                    done();
                },
                status: (statusCode: number) => mockResponse
            };

            feedbackController = new FeedbackController(instance(feedbackDataController));
            feedbackController.getFeedbacks(mockRequest, mockResponse);
            verify(feedbackDataController.getAllFeedback(anyString())).called();
        })

    });

    suite("getSentFeedbacks", () => {

        test("Happy case: test should getSentFeedbacks from FeedbackDataController then call res.json", done => {

            when(feedbackDataController.getSentFeedbacks(anyString())).thenReturn(
                new Promise<any>((resolve, reject) => resolve(mockResult))
            );

            /* If done was called, then the test passed, otherwise timeout */
            const mockResponse: any = {
                send: (result: any) => {
                    expect(result).to.be.equal(mockResult);
                    done();
                },
                status: (statusCode: number) => mockResponse
            };

            feedbackController = new FeedbackController(instance(feedbackDataController));
            feedbackController.getSentFeedbacks(mockRequest, mockResponse);
            verify(feedbackDataController.getSentFeedbacks(anyString())).called();
        });

        test("Sad case: test should getSentFeedbacks from FeedbackDataController then call res.json", done => {

            when(feedbackDataController.getSentFeedbacks(anyString())).thenReturn(
                new Promise<any>((resolve, reject) => reject({}))
            );

            /* If done was called, then the test passed, otherwise timeout */
            const mockResponse: any = {
                json: (error: any) => {
                    done();
                },
                status: (statusCode: number) => mockResponse
            };

            feedbackController = new FeedbackController(instance(feedbackDataController));
            feedbackController.getSentFeedbacks(mockRequest, mockResponse);
            verify(feedbackDataController.getSentFeedbacks(anyString())).called();
        })

    });

    suite("getIncomingFeedbacks", () => {

        test("Happy case: test should getIncomingFeedbacks from FeedbackDataController then call res.json", done => {

            when(feedbackDataController.getIncomingFeedbacks(anyString())).thenReturn(
                new Promise<any>((resolve, reject) => resolve(mockResult))
            );

            /* If done was called, then the test passed, otherwise timeout */
            const mockResponse: any = {
                send: (result: any) => {
                    expect(result).to.be.equal(mockResult);
                    done();
                },
                status: (statusCode: number) => mockResponse
            };

            feedbackController = new FeedbackController(instance(feedbackDataController));
            feedbackController.getIncomingFeedbacks(mockRequest, mockResponse);
            verify(feedbackDataController.getIncomingFeedbacks(anyString())).called();
        });

        test("Sad case: test should getIncomingFeedbacks from FeedbackDataController then call res.json", done => {

            when(feedbackDataController.getIncomingFeedbacks(anyString())).thenReturn(
                new Promise<any>((resolve, reject) => reject({}))
            );

            /* If done was called, then the test passed, otherwise timeout */
            const mockResponse: any = {
                json: (error: any) => {
                    should().exist(error);
                    done();
                },
                status: (statusCode: number) => mockResponse
            };

            feedbackController = new FeedbackController(instance(feedbackDataController));
            feedbackController.getIncomingFeedbacks(mockRequest, mockResponse);
            verify(feedbackDataController.getIncomingFeedbacks(anyString())).called();
        })

    });

    suite("postFeedback", () => {

        test("Happy case: test should postFeedback from FeedbackDataController then call res.send", done => {

            when(feedbackDataController.saveFeedback(anyString(), anything())).thenReturn(
                new Promise<any>((resolve, reject) => resolve(mockResult))
            );

            const mockRequest: any = {
                params: {
                    userId: "userId",
                    orgId: "hipteam"
                },
                body: {data: "data"}
            };

            /* If done was called, then the test passed, otherwise timeout */
            const mockResponse: any = {
                send: (result: any) => {
                    should().equal(result, mockResult);
                    done();
                },
                status: (statusCode: number) => mockResponse
            };

            feedbackController = new FeedbackController(instance(feedbackDataController));
            feedbackController.postFeedback(mockRequest, mockResponse);
            verify(feedbackDataController.saveFeedback(anyString(), anything())).called();
        });

        test("Sad case: test should postFeedback from FeedbackDataController then call res.json", done => {

            when(feedbackDataController.saveFeedback(anyString(), anything())).thenReturn(
                new Promise<any>((resolve, reject) => reject({}))
            );

            /* If done was called, then the test passed, otherwise timeout */
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

            feedbackController = new FeedbackController(instance(feedbackDataController));
            feedbackController.postFeedback(mockRequest, mockResponse);
            verify(feedbackDataController.saveFeedback(anything(), anything())).called();
        });

        test("Sad case: instant error when body is empty", done => {

            const emptyMockRequest: any = {
                body: undefined
            };

            /* If done was called, then the test passed, otherwise timeout */
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

            feedbackController = new FeedbackController(instance(feedbackDataController));
            feedbackController.postFeedback(emptyMockRequest, mockResponse);
            verify(feedbackDataController.saveFeedback(anything(), anything())).called();
        })

    });

});