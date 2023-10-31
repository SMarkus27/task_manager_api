import {TaskService} from "../../services/tasks/service";
import {ITaskController} from "../../core/interfaces/controllers/tasks/interface";
const taskService =  new TaskService();

export class TaskController implements ITaskController {


    async createTask(request, response) {
        const userId = request.user["_id"]
        const taskData = {...request.body, user: userId};
        return  await taskService.createTask(taskData, response);

    };

    async findOneTask(request, response) {
        const taskData = request.params;
        return  await taskService.findOneTask(taskData, response)
    };

    async findAllTasks(request, response){
        const taskData = request.query;
        return await taskService.findAllTasks(taskData, response)
    };

   async updateTask(request, response) {
       const userId = request.user["_id"]
       const taskData = {newData: request.body, ...request.params, user: userId};
       return await taskService.updateTask(taskData, response)
   }
}

