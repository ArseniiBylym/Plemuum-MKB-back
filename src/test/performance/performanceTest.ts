import { FeedbackCollection } from "../../data/database/schema/organization/feedback.schema";
import {RequestCollection} from "../../data/database/schema/organization/request.schema";
import {SkillCollection} from "../../data/database/schema/organization/compass/skill.schema";
import {UserCollection} from "../../data/database/schema/common/user.schema";
import config from "../../../config/config";
import * as mongoose from 'mongoose';
import {getDatabaseManager} from "../../factory/database.factory";
import {StatisticsCollection} from "../../data/database/schema/organization/compass/compass.statistics.schema";

async function populateUsersInteractionsData () {
    //connect to mongo db
    await getDatabaseManager().openConnection(config.mongoUrl);

    const users = await UserCollection().find({orgId: 'hipteam'});
    const numberOfUsers = users.length;
    let testFeedback = {
        "updatedAt": "2017-08-04T08:54:08.195Z",
        "createdAt": "2017-08-04T08:54:08.195Z",
        "senderId": " ",
        "recipientId": " ",
        "context": "Test context",
        "message": "Chuck Norris can compile syntax errors.",
        "type": "CONTINUE",
        "requestId": "",
        "tags": [],
        "privacy": []
    };
    let testRequest = {
        "updatedAt": "2017-08-04T10:27:40.781Z",
        "createdAt": "2017-08-04T10:27:40.781Z",
        "senderId": "",
        "requestMessage": "Test request message",
        "recipientId": ['']
    };


    let testStatistics= {
        "updatedAt": "2017-08-04T10:27:40.781Z",
        "createdAt": "2017-08-04T10:27:40.781Z",
        "user":"",
        "skillScores":[]
    };

    let testSkill  = {
        "name": "Integrity",
        "inactiveSentences": [],
        "sentences": [
            {
                "message": "Takes responsibility for own decisions and behavior."
            },
            {
                "message": "Its willing to admit own mistakes"
            },
            {
                "message": "Questions practices which might violate rules of fairness."
            }
        ]
    };


    for (let i = 0; i < numberOfUsers-1; i++) {
        testFeedback.recipientId = users[i+1]._id;
        testFeedback.senderId = users[i]._id;
        for (let j = 0; j < 100; j++) {
             new (await FeedbackCollection('hipteam'))(testFeedback).save();
        }
    }

    for (let k = 0; k < numberOfUsers-1; k++) {
        testRequest.senderId = users[k]._id;
        testRequest.recipientId[0] = users[k+1]._id;
        for (let l = 0; l < 50; l++) {
             new ( await RequestCollection('hipteam'))(testRequest).save();
        }
    }

    for (let k = 0; k < numberOfUsers-1; k++) {
        for (let l = 0; l < 10; l++) {
            testStatistics.user = users[k]._id;
             new (await SkillCollection('hipteam'))(testSkill).save();
             new (await StatisticsCollection('hipteam'))(testStatistics).save();
        }
    }
   console.log('Generate data complete!');
}
populateUsersInteractionsData();
