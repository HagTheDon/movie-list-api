import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import * as routes from "./api/routes/index.js";
import { errorMessage, status } from "./helpers/status.js";
import knex from "./db/knex.js";
import { Model } from "objection";
import dotenv from "dotenv";

//Temp image directory path
import path from "path";
import { fileURLToPath } from "url";
const __filename = fileURLToPath(import.meta.url); // get the resolved path to the file
const __dirname = path.dirname(__filename); // get the name of the directory

dotenv.config();
const app = express();

app.use(
  cors({
    origin: process.env.WEB_URL,
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
    credentials: true, // Allow cookies and credentials
    optionsSuccessStatus: 204, // Some legacy browsers (IE11, various SmartTVs) choke on 204
  })
);
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

Model.knex(knex);

app.use("/images", express.static(__dirname + "/images"));
app.use("/v1/users", routes.users);
app.use("/v1/movies", routes.movies);
app.use("/v1/images", routes.images);

//Error handling
app.use(function (err, req, res, next) {
  if (res.headersSent) {
    return next(err);
  }
  console.log(err);
  // formulate an error response here
  errorMessage.error =
    "Unable to process request at this time. Please try again later.";
  res.status(status.error).send(errorMessage);
});

// Server will listen to whatever is in the environment variable 'port'
// or 3000 if nothing is specified
const port = process.env.PORT || 8081;

// express returns an HTTP server
app.listen(port, () =>
  console.log("[Server] online " + new Date() + "on port:" + port)
);
