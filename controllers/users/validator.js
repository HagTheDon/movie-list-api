import { body, validationResult } from 'express-validator';

export const registerValidationRules = () => {
  return [
    body('email').isEmail().withMessage('Input a valid email address.'),
    body('password')
      .isLength({ min: 8 })
      .withMessage('Password must be 8 characters or more.'),
    body('role').isInt({ min: 2, max: 3 }).withMessage('Invalid Role.')
  ];
};

export const loginValidationRules = () => {
  return [
    body('email').isEmail().withMessage('Input a valid email address.'),
    body('password')
      .isLength({ min: 8 })
      .withMessage('Password must be 8 characters or more.')
  ];
};

export const emailValidationRules = () => {
  return [body('email').isEmail().withMessage('Input a valid email address.')];
};
export const passwordValidationRules = () => {
  return [
    body('password')
      .isLength({ min: 8 })
      .withMessage('Password must be 8 characters or more.')
  ];
};

export const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (errors.isEmpty()) {
    return next();
  }
  const extractedErrors = [];
  errors.array().map(err => extractedErrors.push({ [err.param]: err.msg }));

  return res.status(422).json({
    errors: extractedErrors
  });
};
