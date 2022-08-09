/* eslint-disable @typescript-eslint/no-invalid-void-type */
import passport, { PassportStatic } from 'passport'
import { NextFunction, Request, Response } from 'express'
import { Strategy, ExtractJwt } from 'passport-jwt'
import { decode, JwtPayload } from 'jsonwebtoken'

import ConfigEnv from '../config/config.env'
import { routePrefix } from '../app'
import { RoleSchema, UserSchema } from '../api/auth/model'
import { CodeError } from '../api/exception'

export class MiddlewareJWT {
  private static _instance: MiddlewareJWT

  private constructor () {
    this.isAdmin = this.isAdmin.bind(this)
  }

  static get getInstance (): MiddlewareJWT {
    if (this._instance instanceof MiddlewareJWT) {
      return this._instance
    }
    this._instance = new MiddlewareJWT()
    return this._instance
  }

  init (): void {
    const opts = {
      jwtFromRequest: ExtractJwt.fromAuthHeaderWithScheme('JWT'),
      secretOrKey: ConfigEnv.SECRETKEY
    }
    passport.use(new Strategy(opts, (decoded, done) => {
      return done(null, decoded)
    }))
  }

  passportJwtMiddleware (req: Request, res: Response, next: NextFunction): void |PassportStatic {
    const routesWithoutMiddleware = [
      `${routePrefix}/ping`,
      `${routePrefix}/auth/login`,
      `${routePrefix}/auth/register`,
      `${routePrefix}/docs/`,
      `${routePrefix}/docs/swagger-ui.css`,
      `${routePrefix}/docs/swagger-ui-bundle.js`,
      `${routePrefix}/docs/swagger-ui-standalone-preset.js`,
      `${routePrefix}/docs/swagger-ui-init.js`,
      `${routePrefix}/docs/swagger-ui-standalone-preset.js`,
      `${routePrefix}/docs/favicon-16x16.png`
    ]
    if (routesWithoutMiddleware.includes(req.url)) {
      return next()
    }
    return passport.authenticate('jwt', { session: false })(req, res, next)
  }

  protected getIdFromToken (token: string): string {
    try {
      const tokenDecode = decode(token, { complete: true })
      const payload: JwtPayload = tokenDecode?.payload as JwtPayload
      return payload.userId as string
    } catch (error: any) {
      throw new CodeError(error)
    }
  }

  async isSecretary (req: Request, res: Response, next: NextFunction): Promise<void | Response> {
    try {
      const { _id } = req.body
      const user = await UserSchema.findById(_id)
      const roles = await RoleSchema.find({ _id: { $in: user?.roles } })
      for (let i = 0; i < roles.length; i++) {
        if (roles[i].name === 'secretary') {
          return next()
        }
      }
      return res.status(404).json({
        ok: false,
        data: {
          error: 'Not found resources required'
        }
      })
    } catch (error) {
      return res.status(500).json({
        ok: false,
        data: {
          error: error
        }
      })
    }
  }

  async isDoctor (req: Request, res: Response, next: NextFunction): Promise<void | Response> {
    try {
      const { _id } = req.body
      const user = await UserSchema.findById(_id)
      const roles = await RoleSchema.find({ _id: { $in: user?.roles } })
      for (let i = 0; i < roles.length; i++) {
        if (roles[i].name === 'doctor') {
          return next()
        }
      }
      return res.status(404).json({
        ok: false,
        data: {
          error: 'Not found resources required'
        }
      })
    } catch (error) {
      return res.status(500).json({
        ok: false,
        data: {
          error: error
        }
      })
    }
  }

  async isAdmin (req: Request, res: Response, next: NextFunction): Promise<void | Response> {
    try {
      const token = req.headers.authorization?.split(' ')[1] as string
      const _id = this.getIdFromToken(token)
      const user = await UserSchema.findById(_id)
      const roles = await RoleSchema.find({ _id: { $in: user?.roles } })
      for (let i = 0; i < roles.length; i++) {
        if (roles[i].name === 'admin') {
          return next()
        }
      }
      return res.status(404).json({
        ok: false,
        data: {
          error: 'Not found resources required'
        }
      })
    } catch (error: any) {
      return res.status(error.code !== undefined ? error.code : 500).json({
        ok: false,
        data: {
          error: error.message !== undefined ? error.message : error
        }
      })
    }
  }
}
