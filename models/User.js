import { Model } from "objection";
import database from "../db/knex.js";

Model.knex(database);

class User extends Model {
  static get tableName() {
    return "users";
  }
  static get idColumn() {
    return "id";
  }
}

export default User;
