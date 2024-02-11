import Controller from "@config/controller";
import { Request, Response } from "express";
import taskService from "./task.service";

class taskController extends Controller {
  async getTaskList(req: Request, res: Response): Promise<void> {
    const response = await taskService.getTaskList(req.query);
    res.status(response.status_code).json(response);
  }
}

export default taskController