import { Model, WhereOptions, Op, Sequelize } from "sequelize";
import { Task } from "@modules/tasks/task.model";
import { TaskGroup } from "@modules/groups/group.model";

export type SearchStrategyType = "default" | "fulltext";

interface SearchStrategy {
  buildSearchQuery(searchQuery: string): WhereOptions;
}

class DefaultSearch implements SearchStrategy {
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

class FullTextSearch implements SearchStrategy {
  private fields: string[];

  constructor(fields: string[]) {
    this.fields = fields;
  }

  buildSearchQuery(searchQuery: string): WhereOptions {
    const matchFields = this.fields.join(", ");
    // Use Sequelize.literal to construct the full-text search condition
    const matchAgainst = Sequelize.literal(
      `MATCH (${matchFields}) AGAINST ('${searchQuery}' IN NATURAL LANGUAGE MODE)`
    );

    return {
      [Op.and]: matchAgainst
    };
  }
}

class SearchStrategyFactory {
  private static strategies = new Map<typeof Model, string[]>();

  static registerStrategy<T extends Model>(
    model: typeof Model & (new () => T),
    fields: string[]
  ): void {
    this.strategies.set(model, fields);
  }

  static getSearchStrategy<T extends Model>(
    model: typeof Model & (new () => T),
    strategy: SearchStrategyType = "default"
  ): SearchStrategy {
    const fields = this.strategies.get(model) || ["defaultField"];
    switch (strategy) {
      case "fulltext":
        return new FullTextSearch(fields);
      case "default":
      default:
        return new DefaultSearch(fields[0]);
    }
  }
}

SearchStrategyFactory.registerStrategy(Task, ["title", "description"]);
SearchStrategyFactory.registerStrategy(TaskGroup, ["name"]);

export default SearchStrategyFactory;
