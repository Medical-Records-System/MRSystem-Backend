import { hashSync, compareSync } from 'bcrypt'
import log4js, { Log4js } from 'log4js'
import ConfigEnv from '../../config/config.env'

const saltRounds = ConfigEnv.SALTROUNDS

export class BcryptService {
  public logger!: any

  private log!: Log4js

  private static _instance: BcryptService

  private constructor () {
    this.config()
  }

  static get getInstance (): BcryptService {
    // eslint-disable-next-line @typescript-eslint/strict-boolean-expressions
    if (this._instance) {
      return this._instance
    }
    this._instance = new BcryptService()
    return this._instance
  }

  private config (): void {
    this.log = log4js
    this.log.configure('./config/log4js.json')
    this.logger = this.log.getLogger('bcryptservice')
  }

  hashPasswordSync (plainTextPwd: string): string {
    try {
      return hashSync(plainTextPwd, saltRounds)
    } catch (err) {
      this.logger.error(err)
      throw new Error('🔴 Error in when create hash password...')
    }
  }

  comparePasswordSync (plainTextPwd: string, hashPassword: string): boolean {
    try {
      return compareSync(plainTextPwd, hashPassword)
    } catch (err) {
      this.logger.error(err)
      throw new Error('🔴 Error compare password...')
    }
  }
}
