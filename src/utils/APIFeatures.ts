import { Model, Op, WhereOptions } from "sequelize";
import SearchStrategyFactory, {
  SearchStrategyType
} from "./searchStrategyFactory";

interface QueryString extends AnyRecord {
  sort?: string;
  fields?: string;
  page?: number;
  perpage?: number;
  q?: string;
}

type QueryOptionsType = {
  order?: Array<[string, "ASC" | "DESC"]>;
  attributes?: string[] | { include: string[]; exclude?: string[] };
  limit?: number;
  offset?: number;
  where?: WhereOptions;
};

class APIFeatures<T extends Model> {
  // `T` is a generic type param extending `Model`: any subclass of `Model` can be used
  private model: typeof Model & (new () => T);
  private queryStr: QueryString;
  private queryOptions: QueryOptionsType = {};
  constructor(model: typeof Model & (new () => T), queryStr: QueryString) {
    this.model = model;
    this.queryStr = queryStr;
  }

  search(strategy?: SearchStrategyType) {
    if (this.queryStr.q) {
      const searchStrategy = SearchStrategyFactory.getSearchStrategy(
        this.model,
        strategy
      );

      this.queryOptions.where = searchStrategy.buildSearchQuery(
        this.queryStr.q
      );
    }
    return this;
  }

  filter() {
    const queryObj = { ...this.queryStr };
    const excludedFields = ["page", "perpage", "sort", "fields", "q"];
    excludedFields.forEach((el) => delete queryObj[el]);

    const whereClause: WhereOptions = {};

    Object.keys(queryObj).forEach((key) => {
      const [field, operator] = key.split("_");
      let value = queryObj[key];

      if (value === "true" || value === "false") {
        value = value === "true";
      }

      switch (operator) {
        case "eq":
          whereClause[field] = value;
          break;
        case "ne":
          whereClause[field] = { [Op.ne]: value };
          break;
        case "gt":
          whereClause[field] = { [Op.gt]: value };
          break;
        case "gte":
          whereClause[field] = { [Op.gte]: value };
          break;
        case "lt":
          whereClause[field] = { [Op.lt]: value };
          break;
        case "lte":
          whereClause[field] = { [Op.lte]: value };
          break;
        case "like":
          whereClause[field] = { [Op.like]: `%${value}%` };
          break;
        case "in":
          whereClause[field] = { [Op.in]: value.split(",") };
          break;
        case "nin":
          whereClause[field] = { [Op.notIn]: value.split(",") };
          break;
        default:
          // if no operator is specified, default to equality
          whereClause[field] = value;
      }
    });

    this.queryOptions.where = {
      ...this.queryOptions.where,
      ...whereClause
    };
    return this;
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
    const result = await this.model.findAndCountAll({
      ...this.queryOptions,
      logging: console.log
    });
    const totalPages = Math.ceil(result.count / this.queryOptions.limit);
    return {
      data: result.rows,
      pagination: {
        page: this.queryOptions.offset + 1,
        perpage: this.queryOptions.limit,
        total_docs: result.count,
        total_pages: totalPages
      }
    };
  }
}

export default APIFeatures;
