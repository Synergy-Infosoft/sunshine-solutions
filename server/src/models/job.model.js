import pool from '../config/db.js';

class JobModel {
  static async findAll() {
    const [rows] = await pool.execute(`
      SELECT j.*, (SELECT COUNT(*) FROM applications WHERE job_id = j.id) as applicant_count 
      FROM jobs j 
      ORDER BY j.created_at DESC
    `);
    return rows;
  }

  static async findById(id) {
    const [rows] = await pool.execute('SELECT * FROM jobs WHERE id = ?', [id]);
    return rows[0];
  }

  static async create(jobData) {
    const { title, company, location, salary, type, posted_time, description, requirements, benefits, featured, status } = jobData;
    
    const [result] = await pool.execute(
      `INSERT INTO jobs (title, company, location, salary, type, posted_time, description, requirements, benefits, featured, status) 
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [title, company, location, salary, type, posted_time, description, JSON.stringify(requirements), JSON.stringify(benefits), featured ? 1 : 0, status || 'active']
    );
    
    return result.insertId;
  }

  static async update(id, jobData) {
    const { title, company, location, salary, type, posted_time, description, requirements, benefits, featured, status } = jobData;
    
    const [result] = await pool.execute(
      `UPDATE jobs SET title = ?, company = ?, location = ?, salary = ?, type = ?, posted_time = ?, description = ?, requirements = ?, benefits = ?, featured = ?, status = ? WHERE id = ?`,
      [title, company, location, salary, type, posted_time, description, JSON.stringify(requirements), JSON.stringify(benefits), featured ? 1 : 0, status, id]
    );
    
    return result.affectedRows > 0;
  }

  static async delete(id) {
    const [result] = await pool.execute('DELETE FROM jobs WHERE id = ?', [id]);
    return result.affectedRows > 0;
  }
}

export default JobModel;
