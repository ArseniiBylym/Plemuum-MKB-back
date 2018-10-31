import { getDatabaseManager } from "../../factory/database.factory";
import config from "../../../config/config";
import { RefreshTokenCollection } from "../../data/database/schema/common/refreshToken.schema";
import { fixtureLoader, testUser } from "../mock/fixture.loader";
import { expect, should } from 'chai';
import { fail } from "assert";
import {validateRefreshTokenResponse} from "../../util/model.validator";
import { refreshTokenDataController, RefreshTokenDataController } from "../../data/datacontroller/refreshToken.datacontroller";
import {getRefreshToken} from "../../util/testobject.factory";
import RefreshToken from "../../data/models/common/refreshToken.model";

suite("Refresh token datacontroller", () => {
    let refTokenDataController: RefreshTokenDataController;
    let insertedTokenId;

    before((done) => {
        refTokenDataController = refreshTokenDataController;
        getDatabaseManager(config.mongoUrl).openConnection()
            .then(() => fixtureLoader())
            .then(value => done())
            .catch((error) => {
                console.error(error);
                done();
            })
    });

    after(done => {
        getDatabaseManager().closeConnection()
            .then(() => done())
            .catch(() => done());
    });

    suite("createRefreshToken", () => {

        after(done => {
            RefreshTokenCollection().remove({})
                .then(() => done())
                .catch(() => done());
        });

        test("Should be able to create a new refreshToken", done => {
            const refreshTkn: RefreshToken = getRefreshToken();
            refTokenDataController.createRefreshToken(refreshTkn)
                .then(() => RefreshTokenCollection().findOne({"refreshToken": refreshTkn.refreshToken}).lean().exec())
                .then((refreshToken: any) => {
                    should().exist(refreshToken);
                    validateRefreshTokenResponse(refreshToken);
                    insertedTokenId = refreshToken._id;
                    done();
                })
        })
    });

    suite("getRefreshTokenByToken", () => {

        const refreshTkn: RefreshToken = getRefreshToken();

        before((done) => {
            refTokenDataController.createRefreshToken(refreshTkn).then(() =>
                done()
            );
        });

        after(done => {
            RefreshTokenCollection().remove({})
                .then(() => done())
                .catch(() => done());
        });

        test("Should be to get a refresh token by it's raw token string", done => {
            refTokenDataController.getRefreshTokenByToken(refreshTkn.refreshToken)
                .then((refreshToken: any) => {
                    should().exist(refreshToken);
                    validateRefreshTokenResponse(refreshToken);
                    expect(refreshToken.refreshToken.toString()).to.be.equal(refreshTkn.refreshToken);
                    expect(refreshToken.accessToken.toString()).to.be.equal(refreshTkn.accessToken);
                    done();
                })
        })
    });

    suite("deleteRefreshToken", () => {

        let refreshTokenId: string;

        before((done) => {
            const refreshTkn: RefreshToken = getRefreshToken();
            refTokenDataController.createRefreshToken(refreshTkn)
                .then(() => RefreshTokenCollection().findOne({"refreshToken": refreshTkn.refreshToken}).lean().exec())
                .then((refreshToken: any) => {
                    should().exist(refreshToken);
                    validateRefreshTokenResponse(refreshToken);
                    refreshTokenId = refreshToken._id;
                    done();
                })
        });

        after(done => {
            RefreshTokenCollection().remove({})
                .then(() => done())
                .catch(() => done());
        });

        test("Should be to delete a refresh token by it's ID", done => {
            refTokenDataController.deleteRefreshToken(refreshTokenId).then( () =>
                RefreshTokenCollection().findOne({_id: refreshTokenId}).lean().exec()
            ).then( (refreshToken: any) => {
                should().not.exist(refreshToken);
                done();
            })
        })
    });
});