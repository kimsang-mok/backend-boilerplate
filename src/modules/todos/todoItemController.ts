import { Request, Response } from "express";
import Controller from "../../config/controller";
import db from "../../config/sequelize";
import todoItemService from "./todoItemService";

class TodoItemController extends Controller {
  constructor() {
    super(db.TodoItem);
  }

  async getTodoItemList(req: Request, res: Response): Promise<void> {
    const response = await todoItemService.getTodoItemList(req.query);
    res.status(response.status_code).json(response);
  }

  async createTodoItem(req: Request, res: Response): Promise<void> {
    const response = await todoItemService.createTodoItem(req.body);
    res.status(response.status_code).json(response);
  }
}

export default new TodoItemController();
