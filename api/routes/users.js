// USER ROUTES
import express from "express";
import withAuth from "../../helpers/routeAccessCheck.js";
import * as usersController from "../../controllers/users/usersController.js";
import permit from "../../helpers/permission.js";
const usersRouter = express.Router();

/**
 * @swagger
 * tags:
 *   name: users
 *   description: Perform User related actions
 * components:
 *   securitySchemes:
 *    bearerAuth:
 *      type: http
 *      scheme: bearer
 *      bearerFormat: JWT
 *   responses:
 *    UnauthorizedError:
 *      description: Access token is missing or invalid
 *      content:
 *        application/json:
 *          schema:
 *            type: object
 *            properties:
 *              status:
 *                type: string
 *                example: error
 *              error:
 *                type: string
 *                example: Access token is missing or invalid
 */

/**
 * @swagger
 * path:
 *  /users/register:
 *    post:
 *      summary: Create account.
 *      tags: [users]
 *      produces:
 *        - application/json
 *      requestBody:
 *        content:
 *          application/x-www-form-urlencoded:
 *            schema:
 *              type: object
 *              properties:
 *                email:
 *                  type: string
 *                password:
 *                  type: string
 *                fullname:
 *                  type: string
 *              required:
 *                - email
 *                - password
 *                - fullname
 *      responses:
 *        '201':
 *          description: Check email to verify account.
 *          content:
 *            application/json:
 *              schema:
 *                type: object
 *                properties:
 *                  status:
 *                    type: string
 *                    example: success
 *                  data:
 *                    type: integer
 *                    example: 12345
 *                  message:
 *                    type: string
 *                    example: Check email to verify account.
 *        default:
 *          description: Something broke.
 */

usersRouter.post("/register", usersController.register);
/**
 * @swagger
 * path:
 *  /users/login:
 *    post:
 *      summary: User login.
 *      tags: [users]
 *      produces:
 *        - application/json
 *      requestBody:
 *        content:
 *          application/x-www-form-urlencoded:
 *            schema:
 *              type: object
 *              properties:
 *                email:
 *                  type: string
 *                password:
 *                  type: string
 *              required:
 *                - email
 *                - password
 *      responses:
 *        '201':
 *          description: Login successful.
 *          content:
 *            application/json:
 *              schema:
 *                type: object
 *                properties:
 *                  status:
 *                    type: string
 *                    example: success
 *                  data:
 *                    type: integer
 *                    example: 12345
 *                  message:
 *                    type: string
 *                    example: Login successful
 *        default:
 *          description: Something broke.
 */
usersRouter.post("/login", usersController.login);

/**
 * @swagger
 * path:
 *  /users/logout:
 *    get:
 *      security:
 *        - bearerAuth: []
 *      summary: Logout user.
 *      tags: [users]
 *      produces:
 *        - application/json
 *      requestBody:
 *        content:
 *          application/x-www-form-urlencoded:
 *      responses:
 *        '201':
 *          description: Logout successful.
 *          content:
 *            application/json:
 *              schema:
 *                type: object
 *                properties:
 *                  status:
 *                    type: string
 *                    example: success
 *                  message:
 *                    type: string
 *                    example: Logout successful
 *        '400':
 *          description: Logout successful.
 *          content:
 *            application/json:
 *              schema:
 *                type: object
 *                properties:
 *                  status:
 *                    type: string
 *                    example: error
 *                  error:
 *                    type: string
 *                    example: Logout successful.
 *        default:
 *          description: Something broke.
 */
usersRouter.get("/logout", withAuth, permit("user"), usersController.logout);

/**
 * @swagger
 * path:
 *  users/:
 *    get:
 *      security:
 *        - bearerAuth: []
 *      summary: Get user profile
 *      tags: [users]
 *      produces:
 *        - application/json
 *      parameters:
 *      responses:
 *        '200':
 *          description: User profile fetch successful.
 *          content:
 *            application/json:
 *              schema:
 *                type: object
 *                properties:
 *                  status:
 *                    type: string
 *                    description: success
 *                  data:
 *                    type: string
 *                    description: User profile values.
 *                  message:
 *                    type: string
 *                    description: User profile fetch successful.
 */
usersRouter.get("/", withAuth, permit("user"), usersController.getProfile);

/**
 * @swagger
 * path:
 *  /users/update-profile:
 *    put:
 *      security:
 *        - bearerAuth: []
 *      summary: Update fullname and profile image.
 *      tags: [users]
 *      produces:
 *        - application/json
 *      requestBody:
 *        content:
 *          application/x-www-form-urlencoded:
 *            schema:
 *              type: object
 *              properties:
 *                fullname:
 *                  type: string
 *                picture_url:
 *                  type: string
 *      responses:
 *        '201':
 *          description: Change password when logged in.
 *          content:
 *            application/json:
 *              schema:
 *                type: object
 *                properties:
 *                  status:
 *                    type: string
 *                    example: success
 *                  data:
 *                    type: object
 *                    example: { token: 12345, id: 4, role: user }
 *                  message:
 *                    type: string
 *                    example: Change password when logged in.
 *        '400':
 *          description: Email does not exist.
 *          content:
 *            application/json:
 *              schema:
 *                type: object
 *                properties:
 *                  status:
 *                    type: string
 *                    example: error
 *                  error:
 *                    type: string
 *                    example: Email does not exist.
 *        default:
 *          description: Something broke.
 */
usersRouter.put("/", withAuth, permit("user"), usersController.updateProfile);

usersRouter.delete(
  "/",
  withAuth,
  permit("user"),
  usersController.deleteProfile
);

export default usersRouter;
