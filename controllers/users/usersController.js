import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import { errorMessage, successMessage, status } from "../../helpers/status.js";
import User from "../../models/User.js";
import Movie from "../../models/Movie.js";
import moment from "moment";

//USER CONTROLLERS

//create user
export const register = async (req, res, next) => {
  var currentDate = moment(new Date()).format("YYYY-MM-DD HH:mm:ss");
  User.query()
    .where({ email: req.body.email })
    .then((result) => {
      if (result.length) {
        errorMessage.message = "An account with that Email already exists.";
        res.status(status.bad).send(errorMessage);
      } else {
        var salt = bcrypt.genSaltSync(10);
        var hash = bcrypt.hashSync(req.body.password, salt);

        User.query()
          .insert({
            name: req.body.name,
            role: "user",
            email: req.body.email,
            password: hash,
            created_at: currentDate,
          })
          .returning("email", "name", "id")
          .then((response) => {
            successMessage.message = `Hello ${response.name}, account created successfully. Login to your account to add movies.`;
            successMessage.data = "";
            res.status(status.created).json(successMessage);
          })
          .catch(next);
      }
    })
    .catch(next);
};

//Login
export const login = async (req, res, next) => {
  User.query()
    .where({ email: req.body.email })
    .first()
    .then((data) => {
      if (data === undefined || data.length === 0) {
        errorMessage.message = "Login failure. Account does not exist.";
        res.status(status.bad).send(errorMessage);
      } else {
        bcrypt.compare(
          req.body.password,
          data.password,
          function (err, result) {
            if (result) {
              const id = data.id;
              const email = data.email;
              const role = data.role;
              const name = data.name;
              const payload = { id, email, role };
              const token = jwt.sign(payload, process.env.JWT_SECRET, {
                expiresIn: req.body.token_expiry || "2h",
              });
              successMessage.data = token;
              successMessage.message = "Login successful.";
              res.status(status.success).json(successMessage);
            } else {
              errorMessage.message =
                "The password does not match with the Email account.";
              res.status(status.bad).send(errorMessage);
            }
          }
        );
      }
    })
    .catch(next);
};

//Logout
export const logout = async (req, res, next) => {
  successMessage.data = "";
  successMessage.message = "Account logout successful.";
  res.status(status.success).json(successMessage);
};

/** Get user profile */
export const getProfile = async (req, res, next) => {
  User.query()
    .where({ id: req.id })
    .select("id", "name", "role", "email", "created_at", "updated_at")
    .first()
    .then((data) => {
      successMessage.data = data;
      successMessage.message = "User profile fetch successful.";
      res.status(status.success).json(successMessage);
    })
    .catch(next);
};

/** Update user profile */
export const updateProfile = async (req, res, next) => {
  var currentDate = moment(new Date()).format("YYYY-MM-DD HH:mm:ss");
  User.query()
    .returning("name", "id")
    .patch({
      name: req.body.name,
      updated_at: currentDate,
    })
    .where({ id: req.id })
    .then((data) => {
      if (data.length > 0) {
        successMessage.data = data;
        successMessage.message = "Profile updated successfully.";
        res.status(status.created).json(successMessage);
      } else {
        errorMessage.error = "Profile update failed.";
        res.status(status.bad).send(errorMessage);
      }
    })
    .catch(next);
};

//Delete Account
export const deleteProfile = async (req, res, next) => {
  Movie.query()
    .delete()
    .where({ user_id: req.id })
    .then(() => {
      User.query()
        .delete()
        .where({ id: req.id })
        .returning("*")
        .then((data) => {
          successMessage.message = "Account deleted successfully.";
          res.status(status.success).json(successMessage);
          res.status(status.success).json(data);
        })
        .catch(next);
    })
    .catch(next);
};
