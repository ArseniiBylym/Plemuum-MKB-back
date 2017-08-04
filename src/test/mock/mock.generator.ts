import * as fs from 'fs';
import fetch from 'node-fetch';

function generateUsers(): Promise<any> {
    return fetch("https://randomuser.me/api/?results=30&nat=gb")
        .then(function (res: any) {
            return res.text();
        })
        .then(function (body: any) {
            const users: any[] = [];
            const parsed = JSON.parse(body);
            const resultUsers = parsed.results;

            resultUsers.forEach(function (resultUser: any) {
                const plenuumUser = {
                    firstName: resultUser.name.first,
                    lastName: resultUser.name.last,
                    email: resultUser.email,
                    password: resultUser.login.password,
                    tokens: [],
                    pictureUrl: resultUser.picture.large,
                    orgIds: ['hipteam']
                };
                users.push(plenuumUser);
            });
            console.log(users.length);
            return users;
        })
        .catch(function (reason) {
            console.error(reason);
        });
}

function saveInJsonFile(filePath: string, data: any): Promise<any> {
    return new Promise((resolve, reject) => {
        fs.writeFile(filePath, JSON.stringify(data), 'utf-8', (err) => {
            if (err) {
                reject(err);
            } else {
                resolve(data);
            }
        });
    });
}

function generateFeedbacks(users: any[]): Promise<any> {
    return fetch('http://api.icndb.com/jokes?limitTo=[nerdy]')
        .then(function (res) {
            return res.text();
        })
        .then(function (body) {
            const feedbacks:any[] = [];
            const parsed = JSON.parse(body);
            const jokes = parsed.value;

            jokes.forEach(function (joke: any) {
                const randomSender = users[Math.floor(Math.random() * users.length)];
                const randomRecipient = users[Math.floor(Math.random() * users.length)]
                if (randomSender !== randomRecipient) {
                    const feedback = {
                        senderId: randomSender._id,
                        recipientId: randomRecipient._id,
                        context: "Mock context",
                        message: joke.joke,
                        creationDate: new Date(),
                        privacy: [],
                        type: "CONTINUE",
                        requestId: "",
                        tags: []
                    };
                    feedbacks.push(feedback);
                }
            });
            return feedbacks;
        })
        .catch(function (reason) {
            console.error(reason);
        })
}

export { generateUsers, generateFeedbacks, saveInJsonFile }
