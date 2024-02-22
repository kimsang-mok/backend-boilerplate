import db from "@configs/sequelize";
// import APIFeatures from "@utils/APIFeatures";
// import { RequestQuery } from "src/interfaces/http";
import { TaskGroup } from "@modules/groups/group.model";
import Service from "@configs/service";
import { RequestQuery } from "src/interfaces/http";
import APIFeatures from "@utils/APIFeatures";

class TaskService extends Service<TaskGroup> {
  protected model = db.Task;

  async get(query: RequestQuery): Promise<any> {
    const apiFeatures = new APIFeatures(this.model, query)
      // .search("fulltext")
      .search("default")
      .filter()
      .sort()
      .limitFields()
      .paginate();
    return apiFeatures.execute();
  }

  async getById(id: string): Promise<any> {
    const result = await this.model.findByPk(id, {
      include: [
        {
          model: TaskGroup,
          as: "taskGroup", // this alias must match the alias used in the association definition
          attributes: ["name"]
        }
      ]
    });
    return result;
  }
}

export default new TaskService();

/*
class TaskService {
  private model: any;

  constructor() {
    this.model = db.Task;
  }

  async getTasks(query: RequestQuery): Promise<any> {
    const apiFeatures = new APIFeatures(this.model, query)
      .search()
      .filter()
      .sort()
      .limitFields()
      .paginate();

    const result = await apiFeatures.execute();
    return result;
  }
  async createTask(body: any): Promise<any> {
    const result = await this.model.create(body);
    return result;
  }
  async getTaskById(id: string): Promise<any> {
    const result = await this.model.findByPk(id, {
      include: [
        {
          model: TaskGroup,
          as: "taskGroup", // this alias must match the alias used in the association definition
          attributes: ["name"]
        }
      ]
    });
    return result;
  }

  async updateTask(id: string, data: any): Promise<any> {
    const result = await this.model.update(data, {
      where: {
        id: id
      }
    });
    return result;
  }

  async deleteTask(id: string): Promise<any> {
    const result = await this.model.destroy({
      where: {
        id: id
      }
    });
    return result;
  }
}

export default new TaskService();
*/
