import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import { errorMessage, successMessage, status } from "../helpers/status.js";
dotenv.config();

const withAuth = function (req, res, next) {
  const isItInHeader = req.headers["authorization"];
  const tokenHeader = isItInHeader && isItInHeader.split(" ")[1];
  const token = req.body.token || req.query.token || tokenHeader;

  if (!token || token === undefined || token === null) {
    errorMessage.error = "No token provided.";
    res.status(status.bad).send(errorMessage);
  } else {
    jwt.verify(token, process.env.JWT_SECRET, function (err, decoded) {
      if (err) {
        errorMessage.error = "Invalid token provided.";
        res.status(status.bad).send(errorMessage);
      } else {
        req.phone = decoded.phone;
        req.id = decoded.id;
        req.role = decoded.role;
        next();
      }
    });
  }
};
export default withAuth;
