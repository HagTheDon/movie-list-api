// WALLET ROUTES
import express from "express";
import withAuth from "../../helpers/routeAccessCheck.js";
import * as moviesController from "../../controllers/movies/moviesController.js";
import permit from "../../helpers/permission.js";
const moviesRouter = express.Router();

moviesRouter.post("/", withAuth, permit("user"), moviesController.create);
moviesRouter.put("/:id", withAuth, permit("user"), moviesController.update);
moviesRouter.get("/:id", withAuth, permit("user"), moviesController.read);
moviesRouter.get("/", withAuth, permit("user"), moviesController.list);
moviesRouter.delete("/:id", withAuth, permit("user"), moviesController.remove);

export default moviesRouter;
