import { Model } from "objection";
import database from "../db/knex.js";
import User from "./User.js";

Model.knex(database);

class Movie extends Model {
  static get tableName() {
    return "movies";
  }
  static get idColumn() {
    return "id";
  }
  static relationMappings() {
    return {
      userDetail: {
        relation: Model.BelongsToOneRelation,
        modelClass: User,
        join: {
          from: "movies.user_id",
          to: "users.id",
        },
      },
    };
  }
}

export default Movie;
