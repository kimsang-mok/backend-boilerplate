import Controller from "@config/controller";
import { Request, Response } from "express";
import taskService from "./task.service";

@AutoBind
class TaskController extends Controller {
  async getTasks(req: Request, res: Response): Promise<void> {
    const result = await taskService.get(req.query);
    this.ok(res, result);
  }
  createTask = Controller.catchAsync(async (req: Request, res: Response) => {
    const result = await taskService.create(req.body);
    this.ok(res, result);
  });
  getTaskById = Controller.catchAsync(async (req: Request, res: Response) => {
    const result = await taskService.getById(req.params.id);
    this.ok(res, result);
  });
}

export default new TaskController();
