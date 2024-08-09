//Middleware for doing role based permissions
import { errorMessage, status } from "../helpers/status.js";

export default function permit(...allowed) {
  const isAllowed = (role) => allowed.indexOf(role) > -1;

  return (req, res, next) => {
    if (isAllowed(req.role)) next();
    else {
      errorMessage.error = "Forbidden.";
      res.status(status.bad).json(errorMessage);
    }
  };
}
