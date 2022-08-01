import { Router } from 'express'
import { check } from 'express-validator'
import { validateFields } from '../../middlewares/validationExpress'
import { AuthHttpHandler } from './http'

export const authRouter = Router()
const authHttpHandler = AuthHttpHandler.getInstance

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
