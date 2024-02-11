import db from "@config/sequelize";
import APIFeatures from "@utils/APIFeatures";
import { RequestQuery } from "src/interfaces/http";

class taskService {
  private model: any;

  constructor() {
    this.model = db.Task;
  }

  async getTaskList(query: RequestQuery): Promise<ResponseObject> {
    const apiFeatures = new APIFeatures(this.model, query)
      .search()
      .filter()
      .sort()
      .limitFields()
      .paginate();

    const response: ResponseObject = {
      status_code: 200,
      message: "Success",
      dev_message: "success",
      data: []
    };

    const result = await apiFeatures.execute();
    response.data = result.data;
    response.pagination = result.pagination;
    return response;
  }
}

export default new taskService();
