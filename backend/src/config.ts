export const config = {
  port: parseInt(process.env.PORT ?? '3001', 10),
  databaseUrl:
    process.env.DATABASE_URL ??
    'postgresql://dailydo:dailydo@localhost:5433/dailydo',
  corsOrigin: process.env.CORS_ORIGIN ?? 'http://localhost:3000',
  testDatabaseUrl:
    process.env.TEST_DATABASE_URL ??
    'postgresql://dailydo:dailydo@localhost:5433/dailydo',
}
