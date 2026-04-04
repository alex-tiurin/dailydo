import { buildApp } from './app'
import { config } from './config'

async function start(): Promise<void> {
  const app = await buildApp()

  try {
    await app.listen({ port: config.port, host: '0.0.0.0' })
    console.log(`DailyDo backend listening on port ${config.port}`)
  } catch (err) {
    console.error(err)
    process.exit(1)
  }
}

start()
