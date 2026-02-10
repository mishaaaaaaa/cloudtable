import { faker } from "@faker-js/faker";
import { pool, QUERIES } from "./db";

const SCHEMA_SQL = `
  CREATE TABLE IF NOT EXISTS rows (
    id SERIAL PRIMARY KEY,
    name TEXT NOT NULL,
    title TEXT,
    company TEXT,
    email TEXT,
    phone TEXT,
    website TEXT,
    status TEXT,
    priority TEXT,
    category TEXT,
    estimated_value NUMERIC,
    budget NUMERIC,
    expenses NUMERIC,
    rating INTEGER,
    notes TEXT,
    description TEXT,
    address TEXT,
    city TEXT,
    country TEXT,
    zip_code TEXT,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
  );
`;

export async function initDatabase() {
  const client = await pool.connect();
  try {
    // Ensure table exists
    await client.query(SCHEMA_SQL);

    // Check if seeded
    const { rows } = await client.query(QUERIES.COUNT);
    if (parseInt(rows[0].count, 10) > 0) {
      console.log("✅ Database already hydrated. Skipping seed.");
      return;
    }

    console.log("🌱 Seeding 50,000 rows...");
    const TOTAL = 50000;
    const BATCH = 1000;

    for (let i = 0; i < TOTAL; i += BATCH) {
      const values: any[] = [];
      const placeholders: string[] = [];
      let pIdx = 1;

      for (let j = 0; j < BATCH; j++) {
        const row = [
          faker.person.fullName(),
          faker.person.jobTitle(),
          faker.company.name(),
          faker.internet.email(),
          faker.phone.number(),
          faker.internet.url(),
          faker.helpers.arrayElement(["Active", "Pending", "Blocked", "Archived"]),
          faker.helpers.arrayElement(["High", "Medium", "Low"]),
          faker.helpers.arrayElement(["Tech", "Finance", "Healthcare", "Retail", "Other"]),
          faker.commerce.price({ min: 1000, max: 50000, dec: 2 }),
          faker.commerce.price({ min: 500, max: 20000, dec: 2 }),
          faker.commerce.price({ min: 0, max: 5000, dec: 2 }),
          faker.number.int({ min: 1, max: 5 }),
          faker.lorem.sentence(),
          faker.lorem.paragraph(),
          faker.location.streetAddress(),
          faker.location.city(),
          faker.location.country(),
          faker.location.zipCode(),
        ];
        values.push(...row);

        const rowP = [];
        for (let k = 0; k < row.length; k++) rowP.push(`$${pIdx++}`);
        placeholders.push(`(${rowP.join(",")})`);
      }

      const query = `
        INSERT INTO rows (
          name, title, company, email, phone, website, status, priority, category,
          estimated_value, budget, expenses, rating, notes, description, address, city, country, zip_code
        ) VALUES ${placeholders.join(", ")}
      `;

      await client.query(query, values);
      console.log(`... Inserted ${Math.min(i + BATCH, TOTAL)} / ${TOTAL}`);
    }
    console.log("🎉 Seeding complete!");
  } catch (e) {
    console.error("Seeding failed:", e);
  } finally {
    client.release();
  }
}
