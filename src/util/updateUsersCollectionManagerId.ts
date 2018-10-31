//node /dist/src/util/updateUsersCollectionManagerId.js
import {getDatabaseManager} from "../factory/database.factory";
import { SurveyTodoCollection } from "../data/database/schema/organization/survey/surveyTodo.schema";
import UserDataController from "../data/datacontroller/user.datacontroller";

async function updateUsersCollectionManagerId () {
    //connect to production mongo db
    
    const mongoUri = 'mongodb://localhost:27017';
    await getDatabaseManager(mongoUri).openConnection();
    //mkb-bank
    //mkb-bank surveyId: 5b7153b4c7c471735d48daac

    let completedSurveyTodos = await SurveyTodoCollection("hipteam").find({survey:"5b531d15617b0c1fb0c73659", isCompleted: true},{respondent: 1, manager: 1});
    let numberOfsurveyTodos = completedSurveyTodos.length;
    for (let i = 0; i<numberOfsurveyTodos; i++) {
        let manager = completedSurveyTodos[i].manager ? completedSurveyTodos[i].manager : ''; 
        await UserDataController.updateUserManagerId(completedSurveyTodos[i].respondent, manager);
        
        console.log(`Updated ${i+1} users from ${numberOfsurveyTodos}`)    
    }
   
   console.log('Update users collection completed!');
}
//updateUsersCollectionManagerId();
