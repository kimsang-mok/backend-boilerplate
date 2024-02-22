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

/**
 * @class APIFeatures
 * @description Provides a fluent interface for building and executing complex queries with Sequelize.
 * Supports searching, filtering, sorting, limiting fields, and pagination.
 *
 * @template T - A generic type parameter extending `Model`, allowing any subclass of `Model` to be used with this class.
 *
 * @param {typeof Model & (new () => T)} model - The Sequelize model class to perform queries on.
 * @param {QueryString} queryStr - An object containing query parameters from the request.
 */
class APIFeatures<T extends Model> {
  // `T` is a generic type param extending `Model`: any subclass of `Model` can be used
  private model: typeof Model & (new () => T);
  private queryStr: QueryString;
  private queryOptions: QueryOptionsType = {};
  constructor(model: typeof Model & (new () => T), queryStr: QueryString) {
    this.model = model;
    this.queryStr = queryStr;
  }

  /**
   * @method search
   * @description Adds search functionality to the query based on a provided strategy.
   *
   * @param {SearchStrategyType} [strategy] - Optional. The search strategy to use.
   * @returns {APIFeatures} - Returns the instance of APIFeatures for method chaining.
   */
  search(strategy?: SearchStrategyType): APIFeatures<T> {
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

  /**
   * @method filter
   * @description Filters the query based on the query parameters, excluding predefined fields.
   *
   * @returns {APIFeatures} - Returns the instance of APIFeatures for method chaining.
   */
  filter(): APIFeatures<T> {
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

  /**
   * @method sort
   * @description Sorts the query results based on the 'sort' query parameter.
   *
   * @returns {APIFeatures} - Returns the instance of APIFeatures for method chaining.
   */
  sort(): APIFeatures<T> {
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

  /**
   * @method limitFields
   * @description Limits the fields to be returned in the query results based on the 'fields' query parameter.
   *
   * @returns {APIFeatures} - Returns the instance of APIFeatures for method chaining.
   */
  limitFields(): APIFeatures<T> {
    if (this.queryStr.fields) {
      const fields = this.queryStr.fields.split(",");
      console.log(fields);
      this.queryOptions.attributes = { include: [], exclude: fields };
    }
    return this;
  }

  /**
   * @method paginate
   * @description Applies pagination to the query based on 'page' and 'perpage' query parameters.
   *
   * @returns {APIFeatures} - Returns the instance of APIFeatures for method chaining.
   */
  paginate(): APIFeatures<T> {
    const page = +this.queryStr.page || 1;
    const limit = +this.queryStr.perpage || 20;
    const offset = (page - 1) * limit;

    this.queryOptions.limit = limit;
    this.queryOptions.offset = offset;

    return this;
  }

  /**
   * @method execute
   * @description Executes the built query and returns the result along with pagination information.
   *
   * @returns {Promise<{data: T[], pagination: Object}>} - A promise that resolves to the query result and pagination info.
   */
  async execute(): Promise<{ data: T[]; pagination: Object }> {
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
