import express, { Application } from 'express'
import cors from 'cors'
import log4js, { Log4js, Logger } from 'log4js'

import ConfigEnv from '../config/config.env'
import { MongoService } from '../services/mongoDb'
import { MiddlewareJWT } from '../middlewares/jwtToken'

import { homeRouter } from '../api/home/router'
import { authRouter } from '../api/auth/router'
import { swaggerDocs } from '../config/swagger'

export class Server {
  public logger!: Logger

  readonly app!: Application
  readonly routePrefix!: string

  private port!: string | number
  private log!: Log4js
  private middlewareJwtPassport!: MiddlewareJWT
  private listen: any
  private readonly mongoService: MongoService

  private static _instance: Server

  private constructor () {
    this.mongoService = MongoService.getInstance
    this.app = express()
    this.routePrefix = '/api/1.0'
    this.config()
    this.middlewares()
    this.routes()
    void this.mongoService.getUri().then((res) => {
      void this.databaseConnection(res)
    })
  }

  static get getInstance (): Server {
    if (this._instance instanceof Server) {
      return this._instance
    }
    this._instance = new Server()
    return this._instance
  }

  private config (): void {
    this.middlewareJwtPassport = new MiddlewareJWT()
    this.middlewareJwtPassport.init()
    this.port = ConfigEnv.PORT ?? 8080
    this.log = log4js
    this.log.configure('./config/log4js.json')
    this.logger = this.log.getLogger('server')
  }

  private middlewares (): void {
    this.app.use(express.json())
    this.app.use(express.urlencoded({ extended: false }))
    this.app.use(cors())
    this.app.use(this.middlewareJwtPassport.passportJwtMiddleware)
  }

  private routes (): void {
    this.app.use(`${this.routePrefix}/ping`, homeRouter)
    this.app.use(`${this.routePrefix}/auth`, authRouter)
  }

  private async databaseConnection (uri: string): Promise<void> {
    return await this.mongoService.connect(uri)
  }

  start (): void {
    if (process.env.NODE_ENV !== 'test') {
      this.listen = this.app.listen(this.port, () => {
        this.logger.info(`[*] Server is running on port ${this.port}...`)
      })
      swaggerDocs(this.app, this.port)
    }
  }

  close (): void {
    this.listen.close()
  }
}
