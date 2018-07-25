const Agenda = require('agenda');
const backgroundScripts = 'src/jobs';
const fs = require('fs');
import sendEmailsInBackground from '../jobs/sendEmailsInBackground';

//for transporter
import EmailManager from "../manager/email/mail.manager";
import config from "../../config/config";

const USERNAME = config.plenuumBotEmail;
const SECRET = config.plenuumBotPass;
const SECURE = true; // This has effect on port, use carefully
const PORT = SECURE ? 465 : 587;
const HOST = 'smtp.gmail.com';
const transporter = EmailManager.getTransport(HOST, PORT, SECURE, USERNAME, SECRET);


// or override the default collection name:
let agenda = new Agenda({db: {address: config.mongoUrl, collection: 'jobs'}});
let jobTypes:any = [];
fs.readdirSync(backgroundScripts).forEach((file:any) => {
    jobTypes.push(file);
});


sendEmailsInBackground(agenda, transporter);

if(jobTypes.length) {
    agenda.on('ready', function() {
        agenda.start();
    });
}

function graceful() {
    agenda.stop(function() {
        process.exit(0);
    });
}

process.on('SIGTERM', graceful);
process.on('SIGINT' , graceful);


export default agenda;