import express, { Application } from 'express'
import log4js, { Log4js } from 'log4js'

import ConfigEnv from '../config/config.env'
import { getUri, connect } from '../services/mongoDb'

import { homeRouter } from '../api/home/router'

export class Server {
  public logger!: any

  readonly app!: Application
  readonly routePrefix!: string

  private port!: string | number
  private log!: Log4js
  private listen: any
  private readonly uri: Promise<string>

  private static _instance: Server

  private constructor () {
    this.uri = getUri()
    this.app = express()
    this.routePrefix = '/api/1.0'
    this.config()
    this.middlewares()
    this.routes()
    void this.databaseConnection()
  }

  static getInstance (): Server {
    // eslint-disable-next-line @typescript-eslint/strict-boolean-expressions
    if (this._instance) {
      return this._instance
    }
    this._instance = new Server()
    return this._instance
  }

  private config (): void {
    this.port = ConfigEnv.PORT ?? 8080
    this.log = log4js
    this.log.configure('./config/log4js.json')
    this.logger = this.log.getLogger('server')
  }

  private middlewares (): void {
    this.app.use(express.json())
    this.app.use(express.urlencoded({ extended: false }))
  }

  private routes (): void {
    this.app.use(`${this.routePrefix}/ping`, homeRouter)
  }

  private async databaseConnection (): Promise<void> {
    await connect(this.uri)
  }

  start (): void {
    if (process.env.NODE_ENV !== 'test') {
      this.listen = this.app.listen(this.port, () => {
        this.logger.info(`[*] Server is running on port ${this.port}...`)
      })
    }
  }

  close (): void {
    this.listen.close()
  }
}
