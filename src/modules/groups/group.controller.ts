import Controller from "@config/controller";
import groupService from "./group.service";
import { Request, Response } from "express";

@AutoBind
class GroupController extends Controller {
  getGroups = Controller.catchAsync(
    async (req: Request, res: Response): Promise<void> => {
      const result = await groupService.getGroups(req.query);
      this.ok(res, result);
    }
  );
  getGroupById = Controller.catchAsync(
    async (req: Request, res: Response): Promise<void> => {
      const result = await groupService.getGroupById(req.params.id);
      this.ok(res, result);
    }
  );
  createGroup = Controller.catchAsync(
    async (req: Request, res: Response): Promise<void> => {
      const result = await groupService.createGroup(req.body);
      this.created(res, result);
    }
  );
  updateGroup = Controller.catchAsync(
    async (req: Request, res: Response): Promise<void> => {
      const result = await groupService.updateGroup(req.params.id, req.body);
      this.ok(res, result);
    }
  );
}

export default new GroupController();
