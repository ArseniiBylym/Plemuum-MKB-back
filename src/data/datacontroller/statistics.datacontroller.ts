import {
    CompassStatisticsModel,
    StatisticsCollection
} from "../database/schema/organization/compass/compass.statistics.schema";

const StatisticsDataController = {

    saveOrUpdateStatistics(orgId: string, statistics: any): Promise<any> {
        if (statistics._id) {
            const id = statistics._id;
            delete statistics._id;
            return StatisticsCollection(orgId).update({_id: id}, statistics).lean().exec();
        } else {
            return new (StatisticsCollection(orgId))(statistics).save();
        }
    },

    getStatisticsByUserId: (orgId: string, userId: string): Promise<CompassStatisticsModel> => {
        return StatisticsCollection(orgId).findOne({user: userId}).lean().exec() as Promise<CompassStatisticsModel>
    }
};

export default StatisticsDataController;