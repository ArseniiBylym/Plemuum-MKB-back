import DatabaseManager from "../../data/database/database.manager";
import * as DatabaseFactory from "../../factory/database.factory";
import * as TestObjectFactory from "../../util/testobject.factory";
import { assert, expect, should } from 'chai';
import * as asserts from "assert";
import { fixtureLoader } from "../mock/fixture.loader";
import UserDataController from "../../data/datacontroller/user.datacontroller";
import { User } from "../../data/models/common/user.model";
import { UserCollection } from "../../data/database/schema/common/user.schema";

suite("UserDataController tests", () => {

    const databaseManager: DatabaseManager = DatabaseFactory.getDatabaseManager();

    beforeEach(done => {
        fixtureLoader()
            .then(value => done())
            .catch((error) => {
                console.error(error);
                done();
            })
    });

    test("New common should be in DB", done => {
        const testUser = TestObjectFactory.getJohnDoe();
        UserDataController.saveUser(testUser)
            .then((value: any) => {
                UserCollection().findById(value._id, (error: Error, user: User) => {
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
                UserDataController.saveUser(testUsers[0]),
                UserDataController.saveUser(testUsers[1]),
                UserDataController.saveUser(testUsers[2]),
                UserDataController.saveUser(testUsers[3])
            ]
        ).then(value => {
            UserDataController.getOrganizationUsers("hipteam")
                .then((users: any) => {
                    expect(users).to.be.an.instanceOf(Array);
                    assert.lengthOf(users, 33);
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