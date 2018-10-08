import {
    CompassStatisticsModel,
    StatisticsCollection
} from "../database/schema/organization/compass/compass.statistics.schema";
import { SkillCollection } from "../database/schema/organization/compass/skill.schema";

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
    },

    getStatisticsByUserIdForExcelFile: (orgId: string, userId: string): any => {
        return StatisticsCollection(orgId).findOne({user: userId},{
            "skillScores.sentenceScores.numberOfDisagree": 1,
            "skillScores.sentenceScores.numberOfAgree": 1,
            "skillScores.sentenceScores.sentence.message": 1,
            "skillScores.skill": 1,
            "_id":0
        }).populate({ path: 'skillScores.skill', model: SkillCollection(orgId), select:'name',})
        .lean().exec() as any
    }
};

export default StatisticsDataController;