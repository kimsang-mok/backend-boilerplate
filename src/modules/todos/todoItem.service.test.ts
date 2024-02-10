import todoItemService from "./todoItem.service";
describe("TodoItem Service Test", () => {
  test("should return list of todo items", async () => {
    const res = await todoItemService.getTodoItemList({});
    expect(res.status_code).toEqual(200);
    expect(res.data).toBeDefined();
  });
});
