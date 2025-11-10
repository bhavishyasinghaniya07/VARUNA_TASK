import { Pool as PgPool } from "pg";

export class DatabasePool {
  private pool: PgPool;

  constructor(connectionString: string) {
    this.pool = new PgPool({
      connectionString,
    });
  }

  async query(text: string, params?: any[]) {
    return this.pool.query(text, params);
  }

  async end() {
    return this.pool.end();
  }
}

