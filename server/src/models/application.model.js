import pool from '../config/db.js';

class ApplicationModel {
  static async create(applicationData) {
    const { role_id, name, phone, experience, location, status } = applicationData;
    
    const [result] = await pool.execute(
      `INSERT INTO applications (role_id, name, phone, experience, location, status) 
       VALUES (?, ?, ?, ?, ?, ?)`,
      [role_id, name, phone, experience, location || 'Not specified', status || 'New']
    );
    
    return result.insertId;
  }

  static async findAll() {
    const [rows] = await pool.execute(`
      SELECT a.*, jr.title as role_title, j.company, j.location as job_location 
      FROM applications a
      JOIN job_roles jr ON a.role_id = jr.id
      JOIN jobs j ON jr.job_id = j.id
      ORDER BY a.created_at DESC
    `);
    return rows;
  }
}

export default ApplicationModel;
