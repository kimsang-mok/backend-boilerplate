import db from "@config/sequelize";
import { RequestQuery } from "src/interfaces/http";
import APIFeatures from "@utils/APIFeatures";
import { Task } from "@modules/tasks/task.model";

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
