import passport, { PassportStatic } from 'passport'
import { NextFunction, Request, Response } from 'express'
import { Strategy, ExtractJwt } from 'passport-jwt'

import ConfigEnv from '../config/config.env'
import { routePrefix } from '../app'

export class MiddlewareJWT {
  init (): void {
    const opts = {
      jwtFromRequest: ExtractJwt.fromAuthHeaderWithScheme('JWT'),
      secretOrKey: ConfigEnv.SECRETKEY
    }
    passport.use(new Strategy(opts, (decoded, done) => {
      return done(null, decoded)
    }))
  }

  // eslint-disable-next-line @typescript-eslint/no-invalid-void-type
  passportJwtMiddleware (req: Request, res: Response, next: NextFunction): void |PassportStatic {
    const routesWithoutMiddleware = [
      `${routePrefix}/ping`,
      `${routePrefix}/auth/login`,
      `${routePrefix}/auth/register`
    ]
    if (routesWithoutMiddleware.includes(req.url)) {
      return next()
    }
    return passport.authenticate('jwt', { session: false })(req, res, next)
  }
}
