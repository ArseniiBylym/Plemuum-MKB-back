import { sleep } from "../util/util";
import SurveyDataController from "../data/datacontroller/survey.datacontroller";
import { UserModel } from "../data/database/schema/common/user.schema";
import { SurveyTodoModel } from "../data/database/schema/organization/survey/surveyTodo.schema";
import getLogger from "../util/logger";

export default async function sendSurveysTodo(orgId: string, surveyId: string, employees: UserModel[]) {
    var startAt = new Date();

    console.log(`Job for sending survey to do start at ${ startAt }.`);
    for (let i = 0; i < employees.length; i++) {
        await sleep(2000);
        let survey = {
            survey: surveyId,
            respondent: employees[i]._id
        } as SurveyTodoModel;
        await SurveyDataController.createSurveyTodo(orgId, survey)
        .then((result) => {
            // to do send email
            console.log(`Survey to do for ${employees[i].email} is created.`);
        })
        .catch((error) => {
            getLogger().error({
                type: "error",
                request: {
                    user: employees[i]
                },
                message: error,
                timeStamp: new Date()
            });
        });
    }

    console.log('Job is completed.');
}
