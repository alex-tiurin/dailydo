import { FastifyInstance } from 'fastify'
import { Pool } from 'pg'
import { buildApp } from '../../src/app'
import { config } from '../../src/config'

let app: FastifyInstance
let testPool: Pool

export async function getApp(): Promise<FastifyInstance> {
  if (!app) {
    testPool = new Pool({ connectionString: config.testDatabaseUrl })
    app = await buildApp(testPool)
  }
  return app
}

export async function getPool(): Promise<Pool> {
  await getApp()
  return testPool
}

export async function cleanDatabase(): Promise<void> {
  const pool = await getPool()
  await pool.query('TRUNCATE TABLE tasks, lists CASCADE')
}

export async function closeAll(): Promise<void> {
  if (app) await app.close()
  if (testPool) await testPool.end()
}
