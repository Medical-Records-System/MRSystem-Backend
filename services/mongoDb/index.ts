import mongoose from 'mongoose'
import { MongoMemoryServer } from 'mongodb-memory-server'

import ConfigEnv from '../../config/config.env'
import { logger } from '../../app'

mongoose.Promise = Promise
let mongoServer: any

interface Options extends Record<string, Promise<string> | string>{}

export const getUri = async (): Promise<string> => {
  mongoServer = await MongoMemoryServer.create()
  const options: Options = {
    test: mongoServer.getUri(),
    development: ConfigEnv.MONGO_URI,
    production: ConfigEnv.MONGO_URI
  }
  return await options[ConfigEnv.NODE_ENV ?? 'development']
}

export const connect = async (uri: Promise<string>): Promise<void> => {
  try {
    const connection = await mongoose.connect(await uri)
    logger.info(`🟢 MongoDB successfully connected to ${connection.connection.host}`)
  } catch (err: any) {
    logger.error(err)
    throw new Error('🔴 Error initializing database... ')
  }
}

export const closeDb = async (): Promise<void> => {
  await mongoose.disconnect()
  if (ConfigEnv.NODE_ENV === 'test') {
    await mongoServer.stop()
  }
}
