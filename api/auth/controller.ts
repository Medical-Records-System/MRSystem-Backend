import { Types } from 'mongoose'
import { decode, JwtPayload } from 'jsonwebtoken'
import { BcryptService } from '../../services/bcrypt'
import { UserSchema } from './model'
import { CodeError } from '../exception'
import { INewUser, IUser } from './types'

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

  async registerUser (newUser: INewUser): Promise<boolean | INewUser> {
    try {
      const { firstName, lastName, email, password } = newUser
      const isEmailRegistered = await UserSchema.findOne({ email }).exec()
      if (isEmailRegistered !== null) {
        return false
      }
      const hashedPwd = this.bcryptService.hashPasswordSync(password)
      const saveUser = new UserSchema({
        firstName,
        lastName,
        email,
        password: hashedPwd
      })
      await saveUser.save()
      return saveUser
    } catch (error: any) {
      throw new CodeError(error)
    }
  }

  async getUserIdFromEmail (email: string): Promise<IUser> {
    try {
      const user = await UserSchema.findOne({ email }).exec()
      if (user !== null) {
        return user
      }
      throw new CodeError({
        code: 404,
        message: `Can't find user with the email '${email}'`
      })
    } catch (error: any) {
      throw new CodeError(error)
    }
  }

  async getUserId (email: string): Promise<Types.ObjectId> {
    try {
      const user = await UserSchema.findOne({ email }).exec()
      if (user !== null) {
        return user?._id
      }
      throw new CodeError({
        code: 404,
        message: `Can't find user with the email '${email}'`
      })
    } catch (error: any) {
      throw new CodeError(error)
    }
  }

  async getUser (userId: Types.ObjectId): Promise<IUser> {
    const user = await UserSchema.findOne({ _id: userId }).exec()
    if (user !== null) {
      return user
    }
    throw new CodeError({
      code: 404,
      message: `Can't find user with the id '${String(userId)}'`
    })
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

  isExpiredToken (token: string): boolean {
    if (token !== undefined) {
      const tokenDecode = decode(token, { complete: true })
      const payload: JwtPayload = tokenDecode?.payload as JwtPayload
      const expiration: number = payload.exp as number
      const now = Math.floor(Date.now() / 1000)
      if (now >= expiration) {
        return true
      }
      return false
    }
    return true
  }
}
