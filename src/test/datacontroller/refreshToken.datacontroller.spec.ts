import { getDatabaseManager } from "../../factory/database.factory";
import config from "../../../config/config";
import { RefreshTokenCollection } from "../../data/database/schema/common/refreshToken.schema";
import { fixtureLoader, testUser } from "../mock/fixture.loader";
import { expect, should } from 'chai';
import {validateRefreshTokenResponse} from "../../util/model.validator";
import { refreshTokenDataController, RefreshTokenDataController } from "../../data/datacontroller/refreshToken.datacontroller";
import {getRefreshToken} from "../../util/testobject.factory";
import RefreshToken from "../../data/models/common/refreshToken.model";

suite("Refresh token datacontroller", () => {
    let refTokenDataController: RefreshTokenDataController;

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

        test("Should be able to create a new refreshToken", done => {
            const refreshTkn: RefreshToken = getRefreshToken();
            refTokenDataController.createRefreshToken(refreshTkn)
                .then(() => RefreshTokenCollection().findOne({"refreshToken": refreshTkn.refreshToken}).lean().exec())
                .then((refreshToken: any) => {
                    should().exist(refreshToken);
                    validateRefreshTokenResponse(refreshToken);
                    done();
                });
        })
    });

    suite("getRefreshTokenByToken", () => {

        test("Should be able to get a refresh token by it's raw token string", done => {
            const refreshTkn = "UM1p5EMooJJfmaSKpUUnfhp32e3C7Ctdu9ABUBYxRJSfHjBddMGPTtK6Km9FEI6SVP9il2dxCje7DycsmBPv49DgCml3OesCu8r6N0DMcd7g64ujjVztH8hSJp2CLJfDolOi85LjNX6J7IXFDIf5VONAIiSu6C6YZTQyo1e00zaC8AX8nhV5wbRzzInieXgQViAwBoP7pEq8KVHGmz0PJIsoRtaMYoVEtIfnhOvyfx8zrcbTxIME8g0wFXhvEzPq";
            const accessTkn = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjViYzhhMjJmMDk4MDA1NjUyM2RjMzhhNCIsImFkbWluIjpmYWxzZSwiY3JlYXRlZEF0IjoiMjAxOC0xMC0yOVQxMToyMDoxMy4yNDVaIiwiZXhwaXJ5RGF0ZSI6NjA0ODAwLCJpYXQiOjE1NDA4MTIwMTMsImV4cCI6MTU0MTQxNjgxM30.tgUSb0gcp4D_802Ora7-z6f2_CBpxEfd1_urzxhBxjw";
            refTokenDataController.getRefreshTokenByToken(refreshTkn)
                .then((refreshToken: any) => {
                    should().exist(refreshToken);
                    validateRefreshTokenResponse(refreshToken);
                    expect(refreshToken.refreshToken.toString()).to.be.equal(refreshTkn);
                    expect(refreshToken.accessToken.toString()).to.be.equal(accessTkn);
                    done();
                })
        })
    });

    suite("deleteRefreshToken", () => {

        test("Should be able to delete a refresh token by it's ID", done => {
            const refreshTokenId = "5bd6eced48c33f051c302658";
            const refreshToken = "UM1p5EMooJJfmaSKpUUnfhp32e3C7Ctdu9ABUBYxRJSfHjBddMGPTtK6Km9FEI6SVP9il2dxCje7DycsmBPv49DgCml3OesCu8r6N0DMcd7g64ujjVztH8hSJp2CLJfDolOi85LjNX6J7IXFDIf5VONAIiSu6C6YZTQyo1e00zaC8AX8nhV5wbRzzInieXgQViAwBoP7pEq8KVHGmz0PJIsoRtaMYoVEtIfnhOvyfx8zrcbTxIME8g0wFXhvEzPq";
            refTokenDataController.deleteRefreshToken(refreshToken).then(() => {
                RefreshTokenCollection().findOne({_id: refreshTokenId}).lean().exec().then((refreshToken: any) => {
                    expect(refreshToken).to.not.exist;
                    done();
                });
            });
        })
    });
});