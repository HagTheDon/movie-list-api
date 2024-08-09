import fs from "fs";
import { S3 } from "@aws-sdk/client-s3";
import { errorMessage, successMessage, status } from "../../helpers/status.js";

//Creating a new instance of S3:
const s3 = new S3({
  credentials: {
    accessKeyId: process.env.ACCESS_KEY_ID,
    secretAccessKey: process.env.SECRET_ACCESS_KEY,
  },
  region: process.env.IAM_REGION,
  signatureVersion: "v4",
});

/** Upload File */
export const uploadFile = async (req, res, next) => {
  // Creating unique file name for upload
  const ext = req.file.filename.split(".").pop();
  const random = Math.floor(Math.random() * 900000000000000000);
  const filename = random + "." + ext;

  fs.readFile(req.file.path, (err, filedata) => {
    if (!err) {
      const putParams = {
        Bucket: process.env.S3_BUCKET_NAME,
        Key: `user_${req.id}/${req.query.asset_type}/${filename}`,
        Body: filedata,
      };
      s3.putObject(putParams, (err, response) => {
        if (err) {
          (errorMessage.error = "Could not upload the file. Error :"), err;
          return res.status(status.bad).send(errorMessage);
        } else {
          fs.unlink(req.file.path, (err) => {
            if (err) throw err;
          }); // Deleting the file from uploads folder(Optional).Do Whatever you prefer.
          successMessage.message = "Successfully uploaded the file.";
          successMessage.data = `user_${req.id}/${req.query.asset_type}/${filename}`;
          return res.status(status.created).send(successMessage);
        }
      });
    } else {
      console.log({ err: err });
      errorMessage.message = "Error uploading image.";
      res.status(status.bad).send(errorMessage);
    }
  });
};

/** Retrieve File */
export const retrieveFile = async (req, res, next) => {
  const getParams = {
    Bucket: process.env.S3_BUCKET_NAME,
    Key: req.params.filename,
  };

  s3.getObject(getParams, function (error, data) {
    if (error) {
      return next(error);
    } else {
      return res.send(data.Body);
    }
  });
};

/** Delete File */
export const deleteFile = async (req, res, next) => {
  const deleteParams = {
    Bucket: process.env.S3_BUCKET_NAME,
    Key: req.query.filepath,
  };

  s3.deleteObject(deleteParams, (error, data) => {
    if (error) {
      return next(error);
    } else {
      successMessage.message = "File has been deleted successfully.";
      successMessage.data = "";
      res.status(status.success).send(successMessage);
    }
  });
};
