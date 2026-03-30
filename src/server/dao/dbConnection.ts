//----------------------------------------
// dbConnection.ts
// Initialise le pool PostgreSQL et expose des helpers de requêtes (simple ou unique) et de gestion de client/fermeture.
// [Auteur : Frédéric Desrosiers]
//----------------------------------------
import { Pool, PoolClient, QueryResultRow} from 'pg'

const pool: Pool = new Pool({
  host: process.env.DB_HOST,
  port: Number(process.env.PGPORT),
  database: process.env.DB_NAME,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
})

export async function dbQuery<T extends QueryResultRow = any>(text: string, params?: any[]): Promise<T[]> {
  const result = await pool.query<T>(text, params)
  return result.rows
}

export async function dbQueryOne<T extends QueryResultRow = any>(text: string, params?: any[]): Promise<T | undefined> {
  const result = await pool.query<T>(text, params)
  return result.rows[0] ?? undefined
}


export async function getClient(): Promise<PoolClient> {
    return pool.connect()
}

export async function closePool(): Promise<void> {
  await pool.end()
}

