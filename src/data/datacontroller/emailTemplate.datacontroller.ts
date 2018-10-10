import { EmailTemplateCollection, EmailTemplateModel } from "../database/schema/common/emailTemplate.schema";
import EmailTemplate from "../models/common/emailTemplate.model";

const EmailTemplateDataController = {
    
        getEmailTemplate: async function  (orgId:string, emailType:string, userAndOrgLang?:any): Promise<EmailTemplate> {
            let emailTemplate:any;
            if (userAndOrgLang.userLang || userAndOrgLang.orgLang){
                emailTemplate = await EmailTemplateCollection().findOne({
                    orgId:orgId,
                    type:emailType,
                    $or: [
                        { lang: userAndOrgLang.userLang },
                        { lang: userAndOrgLang.orgLang }
                      ]
                    }).lean().exec() as Promise<EmailTemplate>;
            }
            if (emailTemplate) {
                return emailTemplate;
            }
            else {
                return EmailTemplateCollection().findOne({orgId:"hipteam", type:emailType}).lean().exec() as Promise<EmailTemplate>;    
            }
        },

        createEmailTemplate: function (emailTemplate: EmailTemplate): Promise<any> {
            return new (EmailTemplateCollection())(emailTemplate).save();
        },

        modifyEmailTemplate: function (emailTemplate: any): Promise<any> {
            const id = emailTemplate._id;
            delete emailTemplate._id;
            return EmailTemplateCollection().findByIdAndUpdate(id, emailTemplate, {new: true}).lean().exec();
        },
        checkEmailTemplate: async function  (orgId:string, emailType:string, lang:any): Promise<EmailTemplate> {
               return EmailTemplateCollection().findOne({
                    orgId:orgId,
                    type:emailType,
                    lang: lang
                    }).lean().exec() as Promise<EmailTemplate>;
        }
    }

export default EmailTemplateDataController