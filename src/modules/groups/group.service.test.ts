import db, { syncDB } from "@config/sequelize";
import { TaskGroup } from "@modules/groups/group.model";
import groupService from "./group.service";
import app from "../../app";
import supertest from "supertest";
import { Sequelize } from "sequelize";

jest.mock("@config/sequelize", () => ({
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

describe("createGroupValidator", () => {
  let mockedSequelize: Sequelize;

  it("should validate that the group name is not empty and has at least 3 characters", async () => {
    // test with invalid data
    const resultWithInvalidData = await supertest(app)
      .post("/api/v1/groups")
      .send({ name: "ab" });
    expect(resultWithInvalidData.status).toBe(422);
    expect(resultWithInvalidData.body.errors).toEqual([
      {
        msg: "Group name must have at least 3 characters long.",
        path: "name",
        location: "body",
        type: "field",
        value: "ab"
      }
    ]);

    // Test with valid data
    // const resultWithValidData = await supertest(app)
    //   .post("/api/v1/groups")
    //   .send({ name: "Valid Group Name" });
    // // expect(resultWithValidData.status).toBe(201);
    // expect(resultWithValidData.body).toEqual({
    //   message: "Created"
    // });
  });
});
