export interface EmailTemplate {
    orgId: string;
    type: string;
    lang: string;
    subject: string;
    html: string;
}
export default EmailTemplate