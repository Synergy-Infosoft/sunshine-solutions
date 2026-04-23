import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import mysql from 'mysql2/promise';
import dotenv from 'dotenv';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.join(__dirname, '../.env') });

async function migrate() {
  if (process.env.NODE_ENV === 'production') {
    console.error('❌ Cannot run destructive migration in production!');
    process.exit(1);
  }

  const connection = await mysql.createConnection({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'sunshine_portal',
    multipleStatements: true
  });

  try {
    console.log('--- Connected. Dropping old tables to recreate schema ---');
    await connection.execute('SET FOREIGN_KEY_CHECKS = 0');
    await connection.execute('DROP TABLE IF EXISTS applications, job_roles, jobs, enquiries, admin');
    await connection.execute('SET FOREIGN_KEY_CHECKS = 1');

    const schemaPath = path.join(__dirname, '../schema.sql');
    const sql = fs.readFileSync(schemaPath, 'utf-8');

    console.log('--- Executing schema.sql ---');
    await connection.query(sql);

    console.log('--- Database schema migrated successfully ---');

    console.log('--- Seeding mock multi-site data ---');
    // Insert 1 site
    const [jobRes] = await connection.execute(
      `INSERT INTO jobs (company, location, status) VALUES ('Amazon Warehouse', 'Jaipur', 'active')`
    );
    const jobId = jobRes.insertId;

    // Insert 3 roles for this site
    await connection.execute(
      `INSERT INTO job_roles (job_id, title, salary_min, salary_max, openings, urgent_hiring) 
       VALUES (?, 'Picker', 12000, 15000, 50, 1),
              (?, 'Packer', 11000, 14000, 40, 0),
              (?, 'Loader', 13000, 16000, 30, 0)`,
      [jobId, jobId, jobId]
    );

    // Insert another site
    const [jobRes2] = await connection.execute(
      `INSERT INTO jobs (company, location, status) VALUES ('BuildMax Construction', 'Delhi', 'active')`
    );
    const jobId2 = jobRes2.insertId;

    // Insert roles
    await connection.execute(
      `INSERT INTO job_roles (job_id, title, type, salary_min, salary_max, openings, urgent_hiring) 
       VALUES (?, 'Excavator Operator', 'Skilled', 20000, 25000, 5, 1),
              (?, 'General Helper', 'Helper', 12000, 14000, 15, 0)`,
      [jobId2, jobId2]
    );

    console.log('--- Seeding complete ---');
  } catch (error) {
    console.error('Migration failed:', error);
  } finally {
    await connection.end();
  }
}

migrate();
