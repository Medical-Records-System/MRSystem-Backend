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

  passportJwtMiddleware (req: Request, res: Response, next: NextFunction): NextFunction | PassportStatic {
    if (req.url === `${routePrefix}/` || req.url === `${routePrefix}/auth/login`) {
      return next
    }
    return passport.authenticate('jwt', { session: false })(req, res, next)
  }
}
