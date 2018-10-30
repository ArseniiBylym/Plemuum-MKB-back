import RefreshToken from "../models/common/refreshToken.model";
import { RefreshTokenCollection } from "../database/schema/common/refreshToken.schema";

interface RefreshTokenDataController {
    createRefreshToken: (refreshTkn: RefreshToken) => Promise<any>
    getRefreshTokenByToken: (token: string) => Promise<any>
    deleteRefreshToken: (id: string) => Promise<any>
    deleteAllOutdated: () => Promise<any>
}

const refreshTokenDataController: RefreshTokenDataController = {

    createRefreshToken(refreshTkn: RefreshToken): Promise<any> {
        return new (RefreshTokenCollection())(refreshTkn).save();
    },

    getRefreshTokenByToken(token: string): Promise<any> {
        return RefreshTokenCollection().findOne({refreshToken: token}).lean().exec();
    },

    deleteRefreshToken(id: string): Promise<any> {
        return RefreshTokenCollection().findByIdAndRemove(id).lean().exec();
    },

    deleteAllOutdated(): Promise<any> {
        return RefreshTokenCollection().findOneAndRemove({expiryDate: {$lt: new Date()}}).lean().exec();
    }
};

export { refreshTokenDataController, RefreshTokenDataController}