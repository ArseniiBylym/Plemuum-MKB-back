const Agenda = require('agenda');
const backgroundScripts = 'src/jobs';
const fs = require('fs');
import sendEmailsInBackground from '../jobs/sendEmailsInBackground';
import deleteOutdatedRefreshTokens from '../jobs/deleteOutdatedRefreshTokens';
import * as sgMail from '@sendgrid/mail';

//for transporter
import EmailManager from "../manager/email/mail.manager";
import config from "../../config/config";

const USERNAME = config.plenuumBotEmail;
const SECRET = config.plenuumBotPass;
const SENGRID_TOKEN = config.plenuumSengridToken;

const transporter = sgMail.setApiKey(SENGRID_TOKEN);

if (typeof config.mongoUrl !== "string") {
    console.log("mongo url not configured. maybe you're missing a NODE_ENV setting?")
    process.exit(1);
}

// or override the default collection name:
let agenda = new Agenda({db: {address: config.mongoUrl, collection: 'jobs'}});
let jobTypes:any = [];
fs.readdirSync(backgroundScripts).forEach((file:any) => {
    jobTypes.push(file);
});

sendEmailsInBackground(agenda, transporter);
deleteOutdatedRefreshTokens(agenda);


if(jobTypes.length) {
    agenda.on('ready', function() {
        agenda.every('1 day','deleteOutdatedRefreshTokens');
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
