import knex from "knex";
import * as config from "../knexfile.js";
import dotenv from "dotenv";
dotenv.config();
const database = knex(config);
export default database;
