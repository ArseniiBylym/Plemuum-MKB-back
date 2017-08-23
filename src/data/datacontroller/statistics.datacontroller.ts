import {
    CompassStatisticsModel,
    StatisticsCollection
} from "../database/schema/organization/compass/compass.statistics.schema";

const StatisticsDataController = {
    getStatisticsByUserId: (orgId: string, userId: string): Promise<CompassStatisticsModel> => {
        return StatisticsCollection(orgId).findOne({_id: userId}).lean().exec() as Promise<CompassStatisticsModel>
    }
};

export default StatisticsDataController;