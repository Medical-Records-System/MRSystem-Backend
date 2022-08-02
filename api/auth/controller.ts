import { BcryptService } from '../../services/bcrypt'
import { AuthSchema } from './model'
import { CodeError } from '../exception'
import { IAuth } from './types'
import { Types } from 'mongoose'

export class AuthController {
  private readonly bcryptService: BcryptService

  private static _instance: AuthController

  private constructor () {
    this.bcryptService = BcryptService.getInstance
  }

  static get getInstance (): AuthController {
    if (this._instance instanceof AuthController) {
      return this._instance
    }
    this._instance = new AuthController()
    return this._instance
  }

  async registerUser (email: string, password: string): Promise<boolean> {
    try {
      const hashedPwd = this.bcryptService.hashPasswordSync(password)
      const newUser = new AuthSchema({
        email,
        password: hashedPwd
      })
      await newUser.save()
      return true
    } catch (error: any) {
      throw new CodeError(error)
    }
  }

  async getUserIdFromEmail (email: string): Promise<IAuth> {
    try {
      const user = await AuthSchema.findOne({ email }).exec()
      if (user === null) {
        throw new CodeError({
          code: 404,
          message: `Can't find user with the email '${email}'`
        })
      }
      return user
    } catch (error: any) {
      throw new CodeError(error)
    }
  }

  async getUserId (email: string): Promise<Types.ObjectId> {
    try {
      const user = await AuthSchema.findOne({ email }).exec()
      if (user === null) {
        throw new CodeError({
          code: 404,
          message: `Can't find user with the email '${email}'`
        })
      }
      return user?._id
    } catch (error: any) {
      throw new CodeError(error)
    }
  }

  async getUser (userId: Types.ObjectId): Promise<IAuth> {
    const user = await AuthSchema.findOne({ _id: userId }).exec()
    if (user === null) {
      throw new CodeError({
        code: 404,
        message: `Can't find user with the id '${String(userId)}'`
      })
    }
    return user
  }

  async checkUserCredentials (email: string, password: string): Promise<boolean> {
    try {
      const user = await this.getUserIdFromEmail(email)
      const isValidPassword = this.bcryptService.comparePasswordSync(password, user.password)
      return isValidPassword
    } catch (error: any) {
      throw new CodeError(error)
    }
  }
}
