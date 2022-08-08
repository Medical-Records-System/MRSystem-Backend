import { Request, Response } from 'express'
import { sign } from 'jsonwebtoken'

import ConfigEnv from '../../config/config.env'
import { AuthController } from './controller'
import { UserSchema } from './model'

const authController = AuthController.getInstance

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
      const isValid = await authController.checkUserCredentials(req.body.email, req.body.password)
      if (!isValid) {
        return res.status(401).json({
          ok: false,
          data: {
            error: 'Invalid credentials check them again'
          }
        })
      }
      const userId = await authController.getUserId(req.body.email)
      const { token } = await authController.getUserIdFromEmail(req.body.email)
      const isExpired = authController.isExpiredToken(token)
      if (isExpired) {
        const tokenCreate = sign({ userId: userId }, ConfigEnv.SECRETKEY, { expiresIn: '8h' })
        await UserSchema.updateOne({ _id: userId }, { $set: { token } }, { upsert: true }).exec()
        return res.status(200).json({
          ok: true,
          data: {
            token: tokenCreate
          }
        })
      }
      return res.status(200).json({
        ok: true,
        data: {
          token
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

  async registerUser (req: Request, res: Response): Promise<Response> {
    try {
      const { firstName, lastName, email, password, roles } = req.body
      const canRegistered = await authController.registerUser({ firstName, lastName, email, password, roles })
      if (canRegistered === false) {
        return res.status(400).json({
          ok: false,
          data: {
            error: 'User is already register!'
          }
        })
      }
      return res.status(201).json({
        ok: true,
        data: canRegistered
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
