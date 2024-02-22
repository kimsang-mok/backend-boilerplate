import Controller from "@configs/controller";
import groupService from "./group.service";
import { Request, Response } from "express";

@AutoBind
class GroupController extends Controller {
  getGroups = Controller.catchAsync(
    async (req: Request, res: Response): Promise<void> => {
      const result = await groupService.get(req.query);
      this.ok(res, result);
    }
  );
  getGroupById = Controller.catchAsync(
    async (req: Request, res: Response): Promise<void> => {
      const result = await groupService.getById(req.params.id);
      this.ok(res, result);
    }
  );
  createGroup = Controller.catchAsync(
    async (req: Request, res: Response): Promise<void> => {
      const result = await groupService.create(req.body);
      this.created(res, result);
    }
  );
  updateGroup = Controller.catchAsync(
    async (req: Request, res: Response): Promise<void> => {
      const result = await groupService.update(req.params.id, req.body);
      console.log(result);
      this.ok(res, result);
    }
  );
}

export default new GroupController();
