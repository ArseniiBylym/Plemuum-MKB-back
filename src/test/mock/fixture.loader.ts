import { FeedbackCollection } from "../../data/database/schema/organization/feedback.schema"
import { RequestCollection } from "../../data/database/schema/organization/request.schema"
import { TagCollection } from "../../data/database/schema/organization/tag.schema"
import * as fs from "fs";
import { Model } from "mongoose";
import { OrganizationCollection } from "../../data/database/schema/organization/organization.schema";
import { GroupCollection } from "../../data/database/schema/organization/group.schema";
import { SkillCollection } from "../../data/database/schema/organization/compass/skill.schema";
import { ResetPasswordCollection } from "../../data/database/schema/common/resetpassword.schema";
import { UserCollection } from "../../data/database/schema/common/user.schema";
import { resetPasswordDataController } from "../../data/datacontroller/resetpassword.datacontroller";
import { CompassTodoCollection } from "../../data/database/schema/organization/compass/compasstodo.schema";
import { StatisticsCollection } from "../../data/database/schema/organization/compass/compass.statistics.schema";
import { CompassAnswerCollection } from "../../data/database/schema/organization/compass/compassanswer.schema";
import SessionManager from "../../api/interactor/session.interactor";
import { SurveyCollection } from "../../data/database/schema/organization/survey/survey.schema";
import { QuestionCollection } from "../../data/database/schema/organization/survey/question.schema";
import { SurveyTodoCollection } from "../../data/database/schema/organization/survey/surveyTodo.schema";
import { AnswerCollection } from "../../data/database/schema/organization/survey/answer.schema";
import { EmailTemplateCollection } from "../../data/database/schema/common/emailTemplate.schema";
import { SurveyTemplateCollection } from "../../data/database/schema/organization/survey/surveyTemplate.schema";


const testUser = {
    "firstName": "sheryl",
    "lastName": "grant",
    "email": "sheryl.grant@hipteam.io",
    "pictureUrl": "https://randomuser.me/api/portraits/women/85.jpg",
    "_id": "5984342227cd340363dc84af",
};

function fixtureLoader(): Promise<any> {
    let promises: Promise<any>[] = [];
    let collections: any[] = [
        {model: UserCollection(), mockFile: 'users'},
        {model: FeedbackCollection('hipteam'), mockFile: 'feedbacks'},
        {model: RequestCollection('hipteam'), mockFile: 'requests'},
        {model: TagCollection('hipteam'), mockFile: 'tags'},
        {model: OrganizationCollection(), mockFile: "organizations"},
        {model: ResetPasswordCollection(), mockFile: null},
        {model: GroupCollection('hipteam'), mockFile: "groups"},
        {model: SkillCollection('hipteam'), mockFile: "skills"},
        {model: CompassTodoCollection('hipteam'), mockFile: "compasstodo"},
        {model: CompassAnswerCollection('hipteam'), mockFile: null},
        {model: StatisticsCollection('hipteam'), mockFile: "statistics"},
        {model: SurveyCollection('hipteam'), mockFile: "surveys"},
        {model: QuestionCollection('hipteam'), mockFile: "questions"},
        {model: SurveyTodoCollection('hipteam'), mockFile: "surveytodos"},
        {model: AnswerCollection('hipteam'), mockFile: "answers"},
        {model: EmailTemplateCollection(), mockFile: "emailTemplates"},
        {model: SurveyTemplateCollection('hipteam'), mockFile: "surveyTemplates"}
    ];

    /* Clear each collection */
    collections.forEach((collection) => promises.push(
        new Promise((resolve, reject) => collection.model.remove({}, () => resolve()))));

    return Promise.all(promises).then(() => {
        /* Read mock data from file and fill up the collections */
        collections.forEach((collection) => {
            if (collection.mockFile) {
                const mocks = JSON.parse(fs.readFileSync(`src/test/mock/json/${collection.mockFile}.json`, 'utf8'));
                mocks.forEach((mock: any) => promises.push(new collection.model(mock).save()));
            }
        });
        return Promise.all(promises);
    })
}

/* Returns a token for tests */
async function authenticate(testUser: any): Promise<string> {
    const sessionManager = new SessionManager();
    return (await sessionManager.login(testUser._id)).token;
}

async function adminAuthenticate(): Promise<string> {
    const sessionManager = new SessionManager();
    return (await sessionManager.loginAsAdmin()).token;
}

async function resetPassword(userId: string): Promise<any> {
    const expiry = new Date();
    expiry.setHours(expiry.getHours() + 5);
    const data: any = {userId: userId, token: "aaabbbccc11122233", token_expiry: expiry, reseted: false};
    const resetPass = await resetPasswordDataController.saveResetPassword(data);
    return resetPass.token;
}

export { fixtureLoader, authenticate, adminAuthenticate, resetPassword, testUser }