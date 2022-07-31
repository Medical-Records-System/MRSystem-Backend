import path from 'path'
import dotenv from 'dotenv'

dotenv.config({ path: path.resolve(__dirname, `../.env.${process.env.NODE_ENV ?? 'development'}.local`) })

interface ENV {
  NODE_ENV: string | undefined
  PORT: number | undefined
  MONGO_URI: string | undefined
  SECRETKEY: string | undefined
  SALTROUNDS: number | undefined
}

interface Config {
  NODE_ENV: string
  PORT: number
  MONGO_URI: string
  SECRETKEY: string
  SALTROUNDS: number
}

const getConfig = (): ENV => {
  return {
    NODE_ENV: process.env.NODE_ENV,
    PORT: (process.env.PORT !== undefined) ? Number(process.env.PORT) : undefined,
    MONGO_URI: process.env.MONGO_URI,
    SECRETKEY: process.env.SECRET,
    SALTROUNDS: process.env.SALTROUNDS !== undefined ? Number(process.env.SALTROUND) : undefined
  }
}

const getSanitizedConfig = (config: ENV): Config => {
  for (const [key, value] of Object.entries(config)) {
    if (value === undefined) {
      throw new Error(`Missing key ${key} in .env`)
    }
  }
  return config as Config
}

const config = getConfig()

const sanitizedConfig = getSanitizedConfig(config)

export default sanitizedConfig
