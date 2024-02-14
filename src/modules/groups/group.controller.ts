import Controller from "@config/controller";
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
  /**
   * @api {post} /groups Create Group
   * @apiName CreateGroup
   * @apiGroup Group
   * @apiVersion 0.0.1
   * @apiDescription Creates a new group.
   *
   * @apiDescription This endpoint creates a new group with the following properties in the request body:
   *
   * ```
   * {
   *   "name": "Group name", // Required, String, The name of the group.
   *   "description": "Group description" // Optional, String, A brief description of the group.
   * }
   * ```
   *
   * @apiSuccess {Number} id Group ID.
   * @apiSuccess {String} name Group name.
   * @apiSuccess {String} description Group description.
   * @apiSuccessExample {json} Success-Response:
   *     HTTP/1.1 201 Created
   *     {
   *       "id": 3,
   *       "name": "Group C",
   *       "description": "Description for Group C"
   *     }
   */
  createGroup = Controller.catchAsync(
    async (req: Request, res: Response): Promise<void> => {
      const result = await groupService.create(req.body);
      this.created(res, result);
    }
  );
  updateGroup = Controller.catchAsync(
    async (req: Request, res: Response): Promise<void> => {
      const result = await groupService.update(req.params.id, req.body);
      this.ok(res, result);
    }
  );
}

export default new GroupController();
