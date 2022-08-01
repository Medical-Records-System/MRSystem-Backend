import { Request, Response } from 'express'
import { sign } from 'jsonwebtoken'

import ConfigEnv from '../../config/config.env'
import { AuthController } from './controller'

export class AuthHttpHandler {
  private static _instance: AuthHttpHandler

  static get getInstance (): AuthHttpHandler {
    if (this._instance instanceof AuthHttpHandler) {
      return this._instance
    }
    this._instance = new AuthHttpHandler()
    return this._instance
  }

  async loginUser (req: Request, res: Response): Promise<Response> {
    try {
      const authController = AuthController.getInstance
      const isValid = await authController.checkUserCredentials(req.body.email, req.body.password)
      if (!isValid) {
        return res.status(401).json({
          ok: false,
          data: {
            error: 'Invalid credentials check them again'
          }
        })
      }
      const user = await authController.getUserId(req.body.email)
      const token = sign({ userId: user }, ConfigEnv.SECRETKEY)
      return res.status(200).json({
        ok: true,
        data: token
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
