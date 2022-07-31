import { Server } from './bin/server'

const server = Server.getInstance()
const appServer = server.app
const logger = server.logger
const routePrefix = server.routePrefix
server.start()

export { server, appServer, routePrefix, logger }
