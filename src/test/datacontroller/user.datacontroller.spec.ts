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


    
    test("Delete user", done => {
        let deletedUser = TestObjectFactory.getTestUserWithOrganizations("John", "Doe", 'hipteam');
        UserDataController.saveUser(deletedUser)
        .then((user:any)=> UserDataController.inactiveUser(user._id.toString()))
        .then((user: any) => {
                should().exist(user);
                expect(user.isActive).to.be.equal(false);
            })
        .then(done, done);
    });

    test("Get my team users", done => {
        UserDataController.getLineManagerEmployees("hipteam", "5984342227cd340363dc84a9")
            .then((myTeamUsers: any) => {
                should().exist(myTeamUsers);
                expect(myTeamUsers).length(3);
            })
            .then(done, done);
    });

    test("Check active user by id", done => {
        UserDataController.checkActiveUserById("5984342227cd340363dc84a9")
            .then((user: any) => {
                should().exist(user);
                expect(user.isActive).to.be.equal(true);
            })
            .then(done, done);
    });

    test("Get organization HR users", done => {
        UserDataController.getHRUsers("hipteam")
            .then((HRUser: any) => {
                should().exist(HRUser)
                expect(HRUser).length(2)
            })
            .then(done, done);
    });

    test("Unset user's managerId", done => {
        UserDataController.unsetUserManager("5984342227cd340363dc84ae")
            .then((user: any) => {
                should().exist(user)
                expect(user.managerId).to.be.equal("")
            })
            .then(done, done);
    });

    test("New user should be in DB", done => {
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
            TestObjectFactory.getTestUserWithOrganizations("John", "Doe", 'hipteam'),
            TestObjectFactory.getTestUserWithOrganizations("John", "Doe", 'hipteam'),
            TestObjectFactory.getTestUserWithOrganizations("John", "Doe", 'other'),
            TestObjectFactory.getTestUserWithOrganizations("John", "Doe", 'else')
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