import db from "@config/sequelize";
import { Task } from "@modules/tasks/task.model";
import Service from "@config/service";
import { TaskGroup } from "./group.model";

class GroupService extends Service<TaskGroup> {
  protected model = db.TaskGroup;

  async getById(id: string): Promise<TaskGroup> {
    const result = await this.model.findOne({
      where: { id },
      include: [
        {
          model: Task,
          as: "tasks",
          attributes: { exclude: ["createdAt", "updatedAt", "deletedAt"] }
        }
      ]
    });
    return result;
  }
}

export default new GroupService();
/*
class GroupService {
  private model;

  constructor() {
    this.model = db.TaskGroup;
  }

  async getGroups(query: RequestQuery): Promise<any> {
    const apiFeatures = new APIFeatures(this.model, query)
      .search()
      .filter()
      .sort()
      .limitFields()
      .paginate();

    const result = await apiFeatures.execute();
    return result;
  }

  async getGroupById(id: string): Promise<any> {
    const result = await this.model.findOne({
      where: { id },
      include: [
        {
          model: Task,
          as: "tasks",
          attributes: { exclude: ["createdAt", "updatedAt", "deletedAt"] }
        }
      ]
    });
    return result;
  }

  async createGroup(body: any): Promise<any> {
    const result = await this.model.create(body);
    return result;
  }

  async updateGroup(id: string, body: any): Promise<any> {
    const result = await this.model.update(body, {
      where: {
        id: id
      }
    });
    return result;
  }

  async deleteGroup(id: string): Promise<any> {
    const result = await this.model.destroy({
      where: {
        id: id
      }
    });
    return result;
  }
}

export default new GroupService();
*/
