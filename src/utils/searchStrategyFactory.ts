import { Model, WhereOptions, Op } from "sequelize";
import { TodoItem } from "../modules/todos/todoItem.model";

export type SearchStrategyType = "default" | "custom";

interface SearchStrategy {
  buildSearchQuery(searchQuery: string): WhereOptions;
}

class DefaultSearchStrategy implements SearchStrategy {
  private field;
  constructor(field: string) {
    this.field = field;
  }

  private createRegexFilters(queryStr: string, field: string): WhereOptions[] {
    const searchTerms = queryStr.split(/\s+/).filter(Boolean);
    const searchPattern = searchTerms.map((term) => `(?=.*${term})`).join("");

    return [
      {
        [field]: {
          [Op.regexp]: searchPattern
        }
      }
    ];
  }

  buildSearchQuery(searchQuery: string): WhereOptions {
    const regexFilters = this.createRegexFilters(searchQuery, this.field);
    return {
      [Op.or]: regexFilters
    };
  }
}

class CustomSearchStrategy implements SearchStrategy {
  private field: string;

  constructor(field: string) {
    this.field = field;
  }

  buildSearchQuery(searchQuery: string): WhereOptions {
    const whereClause: WhereOptions = {};
    // implementation details...
    return whereClause;
  }
}

class SearchStrategyFactory {
  private static strategies = new Map<typeof Model, string>([
    [TodoItem, "title"]
    // add other model-to-field mappings here
  ]);
  static getSearchStrategy<T extends Model>(
    model: typeof Model & (new () => T),
    strategy: SearchStrategyType = "default"
  ): SearchStrategy {
    const field = this.strategies.get(model) || "defaultField";
    switch (strategy) {
      case "custom":
        return new CustomSearchStrategy(field);
      case "default":
      default:
        return new DefaultSearchStrategy(field);
    }
  }
}

export default SearchStrategyFactory;
