// UPLOAD ROUTES
import express from "express";
import withAuth from "../../helpers/routeAccessCheck.js";
import * as imagesController from "../../controllers/images/imagesController.js";
import multer from "multer";
import permit from "../../helpers/permission.js";
const imagesRouter = express.Router();

// configuring the DiscStorage engine.
const storage = multer.diskStorage({
  destination: "images/",
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  },
});
const upload = multer({ storage: storage });

imagesRouter.post(
  "/",
  withAuth,
  permit("admin", "user"),
  upload.single("file"),
  imagesController.uploadFile
  //Multer middleware adds file(in case of single file ) or files(multiple files) object to the request object.
  //req.file is the demo_file
);

imagesRouter.get(
  "/:filename",
  withAuth,
  permit("admin", "user"),
  imagesController.retrieveFile
);

imagesRouter.delete(
  "/",
  withAuth,
  permit("admin", "user"),
  imagesController.deleteFile
);

export default imagesRouter;
