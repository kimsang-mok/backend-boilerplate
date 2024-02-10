import { catchResponse } from "../../utils/httpUtils";
import db from "../../config/sequelize";
import * as Sequelize from "sequelize/types";
import { RequestQuery } from "../../interfaces/http";

class TodoItemService {
  private model: any;
  private exclude_fields: string[];

  constructor() {
    this.model = db.TodoItem;
  }

  /**
   * 사용자 목록 조회
   * query data entity with pagination
   * available params
   * page: number
   * perpage: number
   * relations: comma sparated model name (query including relation data)
   * where: field name
   * where_value: number or string
   * order_by: field name
   * desc: boolean
   * group_by: field name
   *
   * @param query
   * @returns
   */
  async getTodoItemList(query: RequestQuery): Promise<ResponseObject> {
    const page: number = Number(query.page || 1);
    const perpage: number = Number(query.perpage || 20);
    const relations: string = String(query.relations || "");
    const where: string = String(query.where || "");
    const whereValue: string = String(query.where_value || "");
    const offset: number = (page - 1) * perpage;
    const orderBy: string = String(query.order_by || "");
    const isDesc: boolean = query.desc == "true";
    const groupBy: string = String(query.group_by || "");

    const response: ResponseObject = {
      status_code: 200,
      message: "Success",
      dev_message: "success",
      data: [],
      query: {
        where,
        where_value: whereValue,
        desc: isDesc,
        order_by: orderBy,
        group_by: groupBy
      }
    };

    try {
      const count: number = await this.model.count();
      response.pagination = {
        page,
        perpage,
        total_pages: Math.ceil(count / perpage)
      };

      const options: { [key: string]: any } = {
        offset,
        limit: perpage
      };

      if (this.exclude_fields) {
        options.attributes = { exclude: this.exclude_fields };
      }

      // query with join relation
      if (relations !== "") {
        this.model.relationAliases = this.model.relationAliases || [];
        options.include = relations.split(",").map((relation: string) => {
          if (this.model.relationAliases.indexOf(relation) < 0) {
            response.status_code = 422;
            response.dev_message = `some relation not found, avalilable relation are [${this.model.relationAliases.join(
              ","
            )}]`;
            response.message = "Find relation failed";
            throw response;
          }
          return relation;
        });
      }

      // query with where clause
      if (where !== "") {
        options.where = {
          [where]: whereValue
        };
      }

      // query with order clause
      if (orderBy !== "") {
        const order: string[] = [orderBy];
        if (isDesc) {
          order.push("DESC");
        }
        options.order = order;
      }

      // qeury with group by clause
      if (groupBy !== "") {
        options.group = groupBy;
      }

      response.data = await this.model.findAll(options);
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
