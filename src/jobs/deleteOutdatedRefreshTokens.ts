import {default as getLogger} from "../util/logger";
import {refreshTokenDataController} from "../data/datacontroller/refreshToken.datacontroller";

export default async function (agenda: any) {
    agenda.define('deleteOutdatedRefreshTokens', async (job: any, done: any) => {
        console.log('deleteOutdatedRefreshTokens started');
        await refreshTokenDataController.deleteAllOutdated()
            .then(() => done())
            .catch((error: any) => {
                    getLogger().error({
                        type: "error",
                        message: error,
                        timeStamp: new Date()
                    });
                }
            );
    });
}