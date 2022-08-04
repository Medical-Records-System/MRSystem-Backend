import { Router } from 'express'
import { check } from 'express-validator'
import { validateFields } from '../../middlewares/validationExpress'
import { AuthHttpHandler } from './http'

export const authRouter = Router()
const authHttpHandler = AuthHttpHandler.getInstance

/**
 * @openapi
 * /api/1.0/auth/login:
 *   post:
 *     tags:
 *       - Authentication
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: email
 *                 example: admin@admin.com
 *               password:
 *                 type: string
 *                 example: 1234
 *     responses:
 *       200:
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 ok:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   type: object
 *                   properties:
 *                     token:
 *                       type: string
 *                       example: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2MmU5YTQ1YTc1MDEzYjE0MDJlZjRhZDUiLCJpYXQiOjE2NTk0NzkxNTQsImV4cCI6MTY1OTUwNzk1NH0.kgALuRKEk9XAuWoZod0arxOVT60dbZkV_P4TNyNnwkI
 *       400:
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 ok:
 *                   type: boolean
 *                   example: false
 *                 data:
 *                   type: object
 *                   properties:
 *                     errors:
 *                       type: object
 *                       properties:
 *                         email:
 *                           type: object
 *                           properties:
 *                             msg:
 *                               type: string
 *                               example: The email address is required
 *                             param:
 *                               type: string
 *                               example: email
 *                             location:
 *                               type: string
 *                               example: body
 *                         password:
 *                           type: object
 *                           properties:
 *                             msg:
 *                               type: string
 *                               example: Password is required
 *                             param:
 *                               type: string
 *                               example: password
 *                             location:
 *                               type: string
 *                               example: body
 *       401:
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 ok:
 *                   type: boolean
 *                   example: false
 *                 data:
 *                   type: object
 *                   properties:
 *                     error:
 *                       type: string
 *                       example: Invalid credentials check them again
 *       500:
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 ok:
 *                   type: boolean
 *                   example: false
 *                 data:
 *                   type: object
 *                   properties:
 *                     error:
 *                       type: string
 *                       example: Some error message
 */

authRouter.route('/login')
  .post([
    check('email')
      .notEmpty()
      .withMessage('The email address is required')
      .isEmail()
      .withMessage('Please enter a valid email'),
    check('password')
      .notEmpty()
      .withMessage('Password is required'),
    validateFields
  ], authHttpHandler.loginUser)

/**
 * @openapi
 * /api/1.0/auth/register:
 *   post:
 *     tags:
 *       - Authentication
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               firstName:
 *                 type: string
 *                 example: Jean Carlos
 *               lastName:
 *                 type: string
 *                 example: Valencia
 *               email:
 *                 type: email
 *                 example: admin@admin.com
 *               password:
 *                 type: string
 *                 example: 1234
 *               confirmPassword:
 *                 type: string
 *                 example: 1234
 *     responses:
 *       200:
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 ok:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   $ref: '#/components/schemas/User'
 *       400:
 *         description: Bad request
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 ok:
 *                   type: boolean
 *                   example: false
 *                 data:
 *                   type: object
 *                   properties:
 *                     errors:
 *                       type: object
 *                       properties:
 *                         firstName:
 *                           type: object
 *                           properties:
 *                             msg:
 *                               type: string
 *                               example: The first name is required
 *                             param:
 *                               type: string
 *                               example: firstName
 *                             location:
 *                               type: string
 *                               example: body
 *                         lastName:
 *                           type: object
 *                           properties:
 *                             msg:
 *                               type: string
 *                               example: The last name is required
 *                             param:
 *                               type: string
 *                               example: lastName
 *                             location:
 *                               type: string
 *                               example: body
 *                         email:
 *                           type: object
 *                           properties:
 *                             msg:
 *                               type: string
 *                               example: The email address is required
 *                             param:
 *                               type: string
 *                               example: email
 *                             location:
 *                               type: string
 *                               example: body
 *                         password:
 *                           type: object
 *                           properties:
 *                             msg:
 *                               type: string
 *                               example: Password is required
 *                             param:
 *                               type: string
 *                               example: password
 *                             location:
 *                               type: string
 *                               example: body
 *                         confirmPassword:
 *                           type: object
 *                           properties:
 *                             value:
 *                               type: string
 *                               example: 12345
 *                             msg:
 *                               type: string
 *                               example: Password don't match
 *                             param:
 *                               type: string
 *                               example: password
 *                             location:
 *                               type: string
 *                               example: body
 *       500:
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 ok:
 *                   type: boolean
 *                   example: false
 *                 data:
 *                   type: object
 *                   properties:
 *                     error:
 *                       type: string
 *                       example: Some error message
 */

authRouter.route('/register')
  .post([
    check('firstName')
      .notEmpty()
      .withMessage('The first name is required'),
    check('lastName')
      .notEmpty()
      .withMessage('The last name is required'),
    check('email')
      .notEmpty()
      .withMessage('The email address is required')
      .isEmail()
      .withMessage('Please enter a valid email'),
    check('password')
      .notEmpty()
      .withMessage('Password is required')
      .custom((value, { req, path }) => {
        if (value !== req.body.confirmPassword) {
          throw new Error("Passwords don't match")
        } else {
          return value
        }
      }),
    validateFields
  ], authHttpHandler.registerUser)
