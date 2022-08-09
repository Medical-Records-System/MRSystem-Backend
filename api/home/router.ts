import { Router } from 'express'

import { HomeHttpHandler } from './http'
import { MiddlewareJWT } from '../../middlewares/jwtToken'

const middlewareJwt = MiddlewareJWT.getInstance

export const homeRouter = Router()
const homeHttpHandler = new HomeHttpHandler()

homeRouter.route('/')
  .get(homeHttpHandler.getPing)

homeRouter.route('/admin')
  .get([middlewareJwt.isAdmin], homeHttpHandler.getPing)
