import Fastify, { FastifyInstance } from 'fastify'
import cors from '@fastify/cors'
import swagger from '@fastify/swagger'
import swaggerUi from '@fastify/swagger-ui'
import { pool } from './db/pool'
import { ListRepository } from './repositories/listRepository'
import { ListService } from './services/listService'
import { listsRoutes } from './routes/lists'
import { config } from './config'
import { Pool } from 'pg'

export async function buildApp(customPool?: Pool): Promise<FastifyInstance> {
  const app = Fastify({ logger: false })

  await app.register(cors, {
    origin: config.corsOrigin,
  })

  await app.register(swagger, {
    openapi: {
      info: {
        title: 'DailyDo API',
        description: 'Daily task tracking API',
        version: '1.0.0',
      },
      tags: [{ name: 'lists', description: 'Task lists operations' }],
    },
  })

  await app.register(swaggerUi, {
    routePrefix: '/docs',
    uiConfig: { docExpansion: 'list' },
  })

  const dbPool = customPool ?? pool
  const repo = new ListRepository(dbPool)
  const service = new ListService(repo)

  await app.register(listsRoutes, { service })

  return app
}
