import db from "@configs/sequelize";
import { TaskGroup } from "@modules/groups/group.model";
import groupService from "./group.service";

/**
 * The use of mocks allows for testing the service layer in isolation, focusing on the logic
 * rather than the database integration
 */

jest.mock("@configs/sequelize", () => ({
  TaskGroup: {
    findOne: jest.fn()
  }
}));

describe("GroupService", () => {
  describe("getById", () => {
    it("should return a task group for a given id", async () => {
      const mockGroupData: TaskGroup = {
        id: 1,
        name: "Test Group",
        createdAt: new Date(),
        updatedAt: new Date(),
        deletedAt: undefined
      } as unknown as TaskGroup;

      // mock the findOne method to return the mock group data
      (db.TaskGroup.findOne as jest.Mock).mockResolvedValue(mockGroupData);

      const group = await groupService.getById("1");

      expect(db.TaskGroup.findOne).toHaveBeenCalledWith({
        where: { id: "1" },
        include: [
          {
            model: expect.anything(), // since Task model is not mocked here, we use expect.anything()
            as: "tasks",
            attributes: {
              exclude: ["createdAt", "updatedAt", "deletedAt"]
            }
          }
        ]
      });
      expect(group).toEqual(mockGroupData);
    });
  });
});
