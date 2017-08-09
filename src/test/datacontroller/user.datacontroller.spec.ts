import UserDataController from "../../data/datacontroller/user.datacontroller";
import DatabaseManager from "../../data/database/database.manager";
import * as DatabaseFactory from "../../factory/database.factory";
import * as TestObjectFactory from "../../util/testobject.factory";
import { User } from "../../data/models/user.model";
import { assert, expect, should } from 'chai';
import * as asserts from "assert";
import { fixtureLoader } from "../mock/fixture.loader";

suite("UserDataController tests", () => {

    let userDataController: UserDataController;
    const databaseManager: DatabaseManager = DatabaseFactory.getDatabaseManager();

    beforeEach(done => {
        userDataController = new UserDataController(databaseManager);
        fixtureLoader()
            .then(value => done())
            .catch((error) => {
                console.error(error);
                done();
            })
    });

    test("New user should be in DB", done => {
        const testUser = TestObjectFactory.getJohnDoe();
        userDataController.saveUser(testUser)
            .then((value: any) => {
                const userModel = userDataController.getDatabaseModel();
                userModel.findById(value._id, (error: Error, user: User) => {
                    should().exist(user);
                    done();
                });
            })
            .catch(reason => {
                done(reason);
            });
    });

    test("Get users from organization", (done) => {
        const testUsers: User[] = [
            TestObjectFactory.getTestUserWithOrganizations("John", "Doe", ['hipteam']),
            TestObjectFactory.getTestUserWithOrganizations("John", "Doe", ['hipteam', 'other']),
            TestObjectFactory.getTestUserWithOrganizations("John", "Doe", ['other']),
            TestObjectFactory.getTestUserWithOrganizations("John", "Doe", ['else'])
        ];
        Promise.all([
                userDataController.saveUser(testUsers[0]),
                userDataController.saveUser(testUsers[1]),
                userDataController.saveUser(testUsers[2]),
                userDataController.saveUser(testUsers[3])
            ]
        ).then(value => {
            userDataController.getOrganizationUsers("hipteam")
                .then(users => {
                    expect(users).to.be.an.instanceOf(Array);
                    assert.lengthOf(users, 32);
                    done();
                })
                .catch(reason => {
                    asserts.fail(reason);
                    done();
                })
        }).catch(reason => {
            asserts.fail(reason);
            done();
        });
    })
});