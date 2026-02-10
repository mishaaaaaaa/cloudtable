import { Pool } from "pg";

export const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

export const QUERIES = {
  SELECT_ALL: "SELECT * FROM rows ORDER BY id ASC",
  CHECK_CONN: "SELECT NOW()",
  COUNT: "SELECT COUNT(*) FROM rows",
};

export function buildUpdateQuery(id: string, updates: Record<string, any>) {
  const fields = Object.keys(updates);
  if (fields.length === 0) return null;

  const setClause = fields.map((f, i) => `"${f}" = $${i + 2}`).join(", ");
  const values = [id, ...Object.values(updates)];

  const text = `
    UPDATE rows 
    SET ${setClause}, updated_at = NOW() 
    WHERE id = $1 
    RETURNING *
  `;

  return { text, values };
}
