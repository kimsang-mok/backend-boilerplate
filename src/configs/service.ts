import APIError from "@src/utils/APIError";
import APIFeatures from "@utils/APIFeatures";
import { RequestQuery } from "src/interfaces/http";
import { notFound } from "@src/middlewares/error";

export default abstract class Service<T> {
  protected abstract model: any;

  protected handleNotFound(): never {
    throw new APIError({
      status: 404,
      message: "Not found!",
      errors: []
    });
  }

  async get(query: RequestQuery): Promise<any> {
    const apiFeatures = new APIFeatures(this.model, query)
      .search()
      .filter()
      .sort()
      .limitFields()
      .paginate();
    return await apiFeatures.execute();
  }

  async getById(id: string): Promise<T> {
    const result = await this.model.findByPk(id);
    if (!result) {
      this.handleNotFound();
    }
    return result;
  }

  async create(data: T): Promise<T> {
    return await this.model.create(data);
  }

  async update(id: string, data: Partial<T>): Promise<[number, T[]]> {
    return await this.model.update(data, { where: { id } });
  }

  async delete(id: string): Promise<number> {
    return await this.model.destroy({ where: { id } });
  }
}
