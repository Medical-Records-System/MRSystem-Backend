import { Server } from './bin/server'

const server = Server.getInstance
const appServer = server.app
const routePrefix = server.routePrefix
const logger = server.logger
server.start()

export { server, appServer, routePrefix, logger }
