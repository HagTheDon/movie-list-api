import { errorMessage, successMessage, status } from "../../helpers/status.js";
import Movie from "../../models/Movie.js";
import moment from "moment";

export const read = async (req, res, next) => {
  Movie.query()
    .where({ id: req.params.id })
    .first()
    .then((data) => {
      res.status(status.success).json(data);
    })
    .catch(next);
};

//Fix this query
export const list = async (req, res, next) => {
  var limit = 8;
  var offset = 0;
  if (req.query.page) {
    offset = (req.query.page - 1) * limit;
  }

  const request = Movie.query().where({ user_id: req.id });

  const movieRequest = request
    .limit(limit)
    .offset(offset)
    .orderBy("title", "asc");

  movieRequest
    .then((data) => {
      if (data.length > 0) {
        request
          .resultSize()
          .then((dataSize) => {
            var totalPages = Math.ceil(dataSize / limit);
            successMessage.data = { data, dataSize, totalPages };
            successMessage.message = "Movies fetched successfully.";
            res.status(status.success).json(successMessage);
          })
          .catch(next);
      } else {
        errorMessage.error = "No movies found.";
        res.status(status.bad).json(errorMessage);
      }
    })
    .catch(next);
};

export const resultSize = async (req, res, next) => {
  const request = await Movie.query().where({ user_id: req.id });

  if (req.query.search) {
    request.andWhere("title", "ilike", `%${req.query.search}%`);
  }

  request
    .resultSize()
    .then((data) => {
      successMessage.data = data;
      successMessage.message = "Result size fetched successfully.";
      res.status(status.success).json(successMessage);
    })
    .catch(next);
};

export const update = async (req, res, next) => {
  var currentDate = moment(new Date()).format("YYYY-MM-DD HH:mm:ss");
  Movie.query()
    .update({
      title: req.body.title,
      publishing_year: req.body.publishing_year,
      poster_url: req.body.poster_url,
      updated_at: '{"' + currentDate + '"}',
    })
    .returning("*")
    .where({ id: req.params.id })
    .then((data) => {
      res.status(status.success).json(data[0]);
    })
    .catch(next);
};

export const create = async (req, res, next) => {
  Movie.query()
    .insert({
      user_id: req.id,
      title: req.body.title,
      publishing_year: req.body.publishing_year,
      poster_url: req.body.poster_url,
    })
    .returning("*")
    .then((data) => {
      res.status(status.success).json(data);
    })
    .catch(next);
};

export const remove = async (req, res, next) => {
  Movie.query()
    .delete()
    .where({ id: req.params.id })
    .returning("*")
    .then((data) => {
      res.status(status.success).json(data);
    })
    .catch(next);
};
