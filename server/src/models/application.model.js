import pool from '../config/db.js';

class ApplicationModel {
  static async create(applicationData) {
    const { job_id, name, phone, experience, status } = applicationData;
    
    const [result] = await pool.execute(
      `INSERT INTO applications (job_id, name, phone, experience, status) 
       VALUES (?, ?, ?, ?, ?)`,
      [job_id, name, phone, experience, status || 'pending']
    );
    
    return result.insertId;
  }

  static async findAll() {
    const [rows] = await pool.execute(`
      SELECT a.*, j.title as job_title, j.company 
      FROM applications a
      JOIN jobs j ON a.job_id = j.id
      ORDER BY a.created_at DESC
    `);
    return rows;
  }
}

export default ApplicationModel;
