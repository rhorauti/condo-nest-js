import 'dotenv/config';
import { defineConfig, env } from 'prisma/config';

export default defineConfig({
  schema: 'postgres.prisma',
  migrations: {
    path: 'postgres/migrations',
  },
  datasource: {
    url: env('POSTGRES_URL'),
  },
});
