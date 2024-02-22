import app from "@src/app";
import supertest from "supertest";
import { clearDatabaseBeforeEach } from "@src/tests/testHelpers";

clearDatabaseBeforeEach();

describe("createGroupValidator", () => {
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

    // test with valid data
    const resultWithValidData = await supertest(app)
      .post("/api/v1/groups")
      .send({ name: "Valid Group Name" });
    expect(resultWithValidData.body).toMatchObject({
      message: "Created"
    });
    expect(resultWithValidData.statusCode).toBe(201);
  });
});

// test clearDatabaseBeforeEach functions
describe("Group clearing", () => {
  it("should not find the group created in the previous test", async () => {
    const response = await supertest(app).get("/api/v1/groups");
    const groupNames = response.body.data.data.map((group: any) => group.name);
    expect(groupNames).not.toContain("Valid Group Name");
    expect(response.statusCode).toBe(200);
  });
});
