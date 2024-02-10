import { Request } from "express";
import * as Sequelize from "sequelize/types";
import { DB } from "./sequelize";
import locale from "i18n";

export default abstract class Controller {
  // error instance to response object adapter
  protected catchResponse(err: ResponseObject | Error): ResponseObject {
    const res: ResponseObject = {
      status_code: 500,
      message: locale.__("Oops, something went wrong"),
      dev_message: err.message || "internal server error",
      data: []
    };
    if (err instanceof Error) {
      return res;
    }
    return err;
  }

  // helper to convert array of model names to array of models
  protected getRelationModels(relations: string[], db: DB): any[] | Error {
    const relationModels = [];
    for (let idx = 0; idx < relations.length; idx += 1) {
      if (db[relations[idx]]) {
        relationModels.push(db[relations[idx]]);
      }
    }
    if (relationModels.length <= 0) {
      return new Error(`relation "${relations.join(",")}" not found`);
    }
    return relationModels;
  }
}
