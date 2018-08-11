//run js script /dist/src/util/populateUsersInteractionData.js
import { FeedbackCollection } from "../data/database/schema/organization/feedback.schema";
import {RequestCollection} from "../data/database/schema/organization/request.schema";
import {UserCollection} from "../data/database/schema/common/user.schema";
import {getDatabaseManager} from "../factory/database.factory";
import {GroupCollection} from "../data/database/schema/organization/group.schema";
//at the same time no more then 300 user
async function populateUsersInteractionsData () {
    //connect to stagging mongo db
    // mongodb://admin:4jFyAXbwfjH6HmM@37.139.29.52:27017
    const mongoUri = 'mongodb://admin:4jFyAXbwfjH6HmM@37.139.29.52:27017';
    await getDatabaseManager(mongoUri).openConnection();
    let users = await UserCollection().find({orgId:"hipteam"});
    const numberOfUsers = users.length;
    // $or: [{_id:"5a168d585f2c5d0018d79764"},{_id: "5b51eb855271410017e4b694"}, {_id: "5b51eb855271410017e4b696"},
    //     {_id:"5b51eb855271410017e4b698"},{_id:"5b51eb865271410017e4b69a"},{_id:"5b51eb865271410017e4b69c"}]
    let testTags = [
        {
            "_id" : "5a02cf9c7427ce001b3e9f2f",
            "createdAt" : "2017-11-08T08:34:20.993+0000",
            "isActive" : true,
            "order" : 2,
            "title" : "Meeting",
            "updatedAt" : "2017-11-08T08:34:20.993+0000"
        },
        {
            "_id" : "5a65dbb80d8caf0016564da3",
            "createdAt" : "2018-01-22T11:40:24.914+0000",
            "isActive" : true,
            "order" : 6,
            "title" : "Version control",
            "updatedAt" : "2018-01-22T11:40:24.914+0000"
        },
        {
            "_id" : "5a65dbb82f48d80017c3dc8d",
            "createdAt" : "2018-01-22T11:40:24.929+0000",
            "isActive" : true,
            "order" : 6,
            "title" : "Estimations",
            "updatedAt" : "2018-01-22T11:40:24.929+0000"
        },
        {
            "_id" : "5a65dbb80d8caf0016564da4",
            "createdAt" : "2018-01-22T11:40:24.942+0000",
            "isActive" : true,
            "order" : 6,
            "title" : "Architecture",
            "updatedAt" : "2018-01-22T11:40:24.942+0000"
        }
    ];

    let testFeedback = {
        "updatedAt": "2017-08-04T08:54:08.195Z",
        "createdAt": "2017-08-04T08:54:08.195Z",
        "senderId": " ",
        "recipientId": " ",
        "context": "Test context",
        "message": "Chuck Norris can compile syntax errors.",
        "type": "CONTINUE",
        "requestId": "",
        "tags": testTags,
        "privacy": []
    };
    let testRequest = {
        "updatedAt": "2017-08-04T10:27:40.781Z",
        "createdAt": "2017-08-04T10:27:40.781Z",
        "senderId": "",
        "requestMessage": "Test request message",
        "recipientId": ['']
    };





    for (let i = 0; i < numberOfUsers-1; i++) {
        testFeedback.recipientId = users[i+1]._id;
        testFeedback.senderId = users[i]._id;
        console.log('feedback'+i);
        for (let j = 0; j < 100; j++) {
             new (await FeedbackCollection('hipteam'))(testFeedback).save();
        }
    }

    for (let k = 0; k < numberOfUsers-1; k++) {
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
