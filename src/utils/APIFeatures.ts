import { Model } from "sequelize";

interface QueryString {
  sort?: string;
  fields?: string;
  page?: number;
  perpage?: number;
}

type QueryOptionsType = {
  order?: Array<[string, "ASC" | "DESC"]>;
  attributes?: string[] | { include: string[]; exclude?: string[] };
  limit?: number;
  offset?: number;
};

class APIFeatures<T extends Model> {
  private model: typeof Model & (new () => T);
  private queryStr: QueryString;
  private queryOptions: QueryOptionsType;
  constructor(model: typeof Model & (new () => T), queryStr: QueryString) {
    this.model = model;
    this.queryStr = queryStr;
    this.queryOptions = {};
  }

  sort() {
    if (this.queryStr.sort) {
      const sortBy = this.queryStr.sort.split(",").map((item) => {
        let order = "ASC";
        let field = item;
        if (item.startsWith("-")) {
          field = item.slice(1);
          order = "DESC";
        }
        return [field, order] as [string, "ASC" | "DESC"];
      });
      this.queryOptions.order = sortBy;
    }
    return this;
  }

  limitFields() {
    if (this.queryStr.fields) {
      const fields = this.queryStr.fields.split(",");
      console.log(fields);
      this.queryOptions.attributes = { include: [], exclude: fields };
    }
    return this;
  }

  paginate() {
    const page = +this.queryStr.page || 1;
    const limit = +this.queryStr.perpage || 20;
    const offset = (page - 1) * limit;

    this.queryOptions.limit = limit;
    this.queryOptions.offset = offset;

    return this;
  }

  async execute() {
    const result = await this.model.findAndCountAll(this.queryOptions);
    const totalPages = Math.ceil(result.count / this.queryOptions.limit);
    return {
      data: result.rows,
      pagination: {
        page: +this.queryStr.page,
        perpage: this.queryOptions.limit,
        total_pages: totalPages
      }
    };
  }
}

export default APIFeatures;
