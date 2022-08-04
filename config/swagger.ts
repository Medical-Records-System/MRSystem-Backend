import swaggerJSDoc from 'swagger-jsdoc'
import swaggerUi from 'swagger-ui-express'
import { Application, Response } from 'express'

import { routePrefix, logger } from '../app'
import packagejson from '../package.json'

const version: string = packagejson.version

const options = {
  definition: {
    openapi: '3.0.3',
    info: {
      title: 'Medical Records System Api', version: version
    },
    components: {
      securitySchemes: {
        Authorization: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
          in: 'header',
          value: 'JWT <JWT token here>'
        }
      }
    }

  },
  apis: [
    './api/auth/router.ts', './api/auth/model.ts'
  ]
}

const swaggerSpec = swaggerJSDoc(options)

export const swaggerDocs = (app: Application, port: string | number): void => {
  app.use(`${routePrefix}/docs/`, swaggerUi.serve, swaggerUi.setup(swaggerSpec))
  app.get(`${routePrefix}/docs.json`, (_req, res: Response) => {
    res.setHeader('Content-Type', 'application/json')
    res.send(swaggerSpec)
  })
  logger.info(`Version ${version} Docs are available on http://localhost:${port}${routePrefix}/docs`)
}
