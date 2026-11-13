import { Pool, QueryResult, QueryResultRow } from 'pg';

declare global {
  // eslint-disable-next-line no-var
  var __pgPool: Pool | undefined;
}

function createPool(): Pool | null {
  const connectionString = process.env.DATABASE_URL;
  const instanceConnectionName = process.env.CLOUD_SQL_CONNECTION_NAME;
  const dbUser = process.env.DB_USER;
  const dbPassword = process.env.DB_PASSWORD;
  const dbName = process.env.DB_NAME || 'solven';

  if (instanceConnectionName && dbUser && dbPassword) {
    return new Pool({
      user: dbUser,
      password: dbPassword,
      database: dbName,
      host: `/cloudsql/${instanceConnectionName}`,
      max: 10,
      idleTimeoutMillis: 30000,
      connectionTimeoutMillis: 5000,
    });
  }

  if (connectionString) {
    return new Pool({
      connectionString,
      max: 10,
      idleTimeoutMillis: 30000,
      connectionTimeoutMillis: 5000,
    });
  }

  return null;
}

export function getPool(): Pool | null {
  if (!global.__pgPool) {
    const pool = createPool();
    if (pool) {
      global.__pgPool = pool;
    }
  }
  return global.__pgPool || null;
}

export function isDatabaseConfigured(): boolean {
  return Boolean(
    process.env.DATABASE_URL ||
      (process.env.CLOUD_SQL_CONNECTION_NAME && process.env.DB_USER && process.env.DB_PASSWORD)
  );
}

export async function query<T extends QueryResultRow = QueryResultRow>(
  text: string,
  params?: unknown[]
): Promise<QueryResult<T>> {
  const pool = getPool();
  if (!pool) {
    throw new Error('GCP Cloud SQL database is not configured');
  }
  return pool.query<T>(text, params);
}
