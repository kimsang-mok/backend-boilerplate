import { catchResponse } from "../../utils/httpUtils";
import db from "../../config/sequelize";
import { RequestQuery } from "../../interfaces/http";
import APIFeatures from "../../utils/APIFeatures";

class TodoItemService {
  private model: any;
  // private exclude_fields: string[];

  constructor() {
    this.model = db.TodoItem;
  }

  async getTodoItemList(query: RequestQuery): Promise<ResponseObject> {
    const apiFeatures = new APIFeatures(this.model, query)
      .sort()
      .limitFields()
      .paginate();

    const response: ResponseObject = {
      status_code: 200,
      message: "Success",
      dev_message: "success",
      data: []
      // query: {
      //   where,
      //   where_value: whereValue,
      //   desc: isDesc,
      //   order_by: orderBy,
      //   group_by: groupBy
      // }
    };

    try {
      const result = await apiFeatures.execute();
      response.data = result.data;
      response.pagination = result.pagination;
      return response;
    } catch (err) {
      return catchResponse(err);
    }
  }

  async createTodoItem(body: any): Promise<ResponseObject> {
    const response: ResponseObject = {
      status_code: 201,
      message: "Success",
      dev_message: "success",
      data: []
    };

    try {
      const result: any = await this.model.create(body);
      response.data = result.toJSON();
      return response;
    } catch (err) {
      return catchResponse(err);
    }
  }
}

export default new TodoItemService();
