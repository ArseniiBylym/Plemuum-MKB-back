//run js script /dist/src/util/populateUsersInteractionData.js
import { FeedbackCollection } from "../data/database/schema/organization/feedback.schema";
import {RequestCollection} from "../data/database/schema/organization/request.schema";
import {UserCollection} from "../data/database/schema/common/user.schema";
import {getDatabaseManager} from "../factory/database.factory";
import {GroupCollection} from "../data/database/schema/organization/group.schema";
//at the same time no more then 300 user
async function populateUsersInteractionsData () {
    //connect to stagging mongo db
    await getDatabaseManager().openConnection('mongodb://admin:4jFyAXbwfjH6HmM@37.139.29.52:27017');
    let users = await UserCollection().find({orgId: 'hipteam', lastName: 'pisti'});
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



    for (let i = 0; i < numberOfUsers; i++) {
        testFeedback.recipientId = users[i+1]._id;
        testFeedback.senderId = users[i]._id;
        console.log('feedback'+i);
        for (let j = 0; j < 100; j++) {
             new (await FeedbackCollection('hipteam'))(testFeedback).save();
        }
    }

    for (let k = 0; k < numberOfUsers; k++) {
        testRequest.senderId = users[k]._id;
        testRequest.recipientId[0] = users[k+1]._id;
        console.log('request'+k);
        for (let l = 0; l < 50; l++) {
             new ( await RequestCollection('hipteam'))(testRequest).save();
        }
    }

    for (let l = 0; l < numberOfUsers; l++) {
        console.log('skill'+l);
           await GroupCollection('hipteam').update({_id: "5ac611050d8caf001656530d"}, {$push: {users: users[l]._id}}).lean().exec()
    }

   console.log('Generate data complete!');
}
// populateUsersInteractionsData();
