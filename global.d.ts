export namespace NodeJs {
  export interface ProcessEnv {
    NODE_ENV: string
    PORT: string | number
    MONGO_URI: string
  }
}
