import { databaseNameValidator } from "../../util/regexp.checker";
import { ErrorType, PlenuumError } from "../../util/errorhandler";
import EmailTemplateDataController from "../../data/datacontroller/emailTemplate.datacontroller";

export default class EmailTemplateInteractor {

    async getEmailTemplate(orgId:string, emailType:string, emailLang:string) {
        return EmailTemplateDataController.getEmailTemplate(orgId, emailType, emailLang);
    }

    async createEmailTemplate(emailTemplate: any) {
        const existingEmailTemplate = await EmailTemplateDataController.checkEmailTemplate(emailTemplate.orgId,emailTemplate.type,emailTemplate.lang);
        if (!existingEmailTemplate) {
            return EmailTemplateDataController.createEmailTemplate(emailTemplate);
        } else {
            throw new PlenuumError(
                "The email template alredy exist.", ErrorType.VALIDATION)
        }
    }

    async modifyEmailTemplate(emailTemplate: any) {
        const existingEmailTemplate = await EmailTemplateDataController.getEmailTemplate(emailTemplate.orgId,emailTemplate.type,emailTemplate.lang);
        if (!existingEmailTemplate) {
            throw new PlenuumError("Email template does not exist", ErrorType.NOT_FOUND)
        }
        return EmailTemplateDataController.modifyEmailTemplate(emailTemplate);
    }
}