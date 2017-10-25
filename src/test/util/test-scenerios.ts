const adam = {
    _id: "5984342227cd340363dc84a9"
};
const hakim = {
    _id: "5984342227cd340363dc84c7"
};
const fabricio = {
    _id: "5984342227cd340363dc84aa"
};
const eve = {
    _id: "5984342227cd340363dc84ab"
};
const liu = {
    _id: "5984342227cd340363dc84ac"
};
const bono = {
    _id: "5984342227cd340363dc84ad"
};

const communication = {
    "_id": "5940f5f44d0d550007d863dc",
    "name": "Communication",
    "inactiveSentences": [],
    "sentences": [
        {
            "message": "Communication 1",
            "_id": "599e88721a6ec6039715b542"
        },
        {
            "message": "Communication 2",
            "_id": "599e88721a6ec6039715b541"
        },
        {
            "message": "Communication 3",
            "_id": "599e88721a6ec6039715b540"
        }
    ]
};
const interpersonalEffectiveness = {
    "_id": "5940f6144d0d550007d863e2",
    "name": "Interpersonal Effectiveness",
    "inactiveSentences": [],
    "sentences": [
        {
            "message": "Interpersonal Effectiveness 1",
            "_id": "599e88721a6ec6039715b542"
        },
        {
            "message": "Interpersonal Effectiveness 2",
            "_id": "599e88721a6ec6039715b541"
        },
        {
            "message": "Interpersonal Effectiveness 3",
            "_id": "599e88721a6ec6039715b540"
        }
    ]
};
const leadership = {
    "_id": "5940f6044d0d550007d863df",
    "name": "Leadership",
    "inactiveSentences": [],
    "sentences": [
        {
            "message": "Leadership 1",
            "_id": "599e88721a6ec6039715b542"
        },
        {
            "message": "Leadership 2",
            "_id": "599e88721a6ec6039715b541"
        },
        {
            "message": "Leadership 3",
            "_id": "599e88721a6ec6039715b540"
        }
    ]
};
const databases = {
    "_id": "5940f61e4d0d550007d863e5",
    "name": "Databases",
    "inactiveSentences": [],
    "sentences": [
        {
            "message": "Databases 1",
            "_id": "599e88721a6ec6039715b542"
        },
        {
            "message": "Databases 2",
            "_id": "599e88721a6ec6039715b541"
        },
        {
            "message": "Databases 3",
            "_id": "599e88721a6ec6039715b540"
        }
    ]
};

const marketingID = "599312a31b31d008b6bd2782";
const itID = "599312971b31d008b6bd2781";
const dbEngineersID = "599312a81b31d008b6bd2783";
const callCenterID = "599312aa1b31d008b6bd2784";

const marketing: any = {
    _id: marketingID,
    name: "Marketing",
    users: [hakim._id, fabricio._id],
    skills: [communication._id, leadership._id, interpersonalEffectiveness._id],
    todoCardRelations: [],
    answerCardRelations: []
};
const IT: any = {
    _id: itID,
    name: "Marketing",
    users: [adam._id, eve._id],
    skills: [communication._id, leadership._id],
    todoCardRelations: [],
    answerCardRelations: []
};
const dbEngineers: any = {
    _id: dbEngineersID,
    name: "Marketing",
    users: [adam._id, liu._id],
    skills: [communication._id, databases._id],
    todoCardRelations: [dbEngineersID, itID],
    answerCardRelations: [dbEngineersID, itID]
};
const callCenter: any = {
    _id: callCenterID,
    name: "Marketing",
    users: [bono._id],
    skills: [communication._id, interpersonalEffectiveness._id],
    todoCardRelations: [callCenterID],
    answerCardRelations: [callCenterID]
};

const scenarioOneGroups = [marketing, IT, dbEngineers, callCenter];
const scenarioOneUsers = [adam, hakim, fabricio, eve, liu, bono];
const scenarioOneSkills = [communication, interpersonalEffectiveness, leadership, databases];

const copy = (obj: any) => JSON.parse(JSON.stringify(obj));

export function getScenarioOneGroups() {
    return copy(scenarioOneGroups);
}

export function getScenarioOneUsers() {
    return copy(scenarioOneUsers);
}

export function getScenarioOneSkills() {
    return copy(scenarioOneSkills);
}
