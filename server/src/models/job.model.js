import pool from '../config/db.js';

class JobModel {
  static async findAll() {
    const [jobs] = await pool.execute(`
      SELECT j.* 
      FROM jobs j 
      ORDER BY j.created_at DESC
    `);

    if (jobs.length === 0) return [];

    const jobIds = jobs.map(j => j.id);
    const [roles] = await pool.query(`
      SELECT jr.*, 
        (SELECT COUNT(*) FROM applications WHERE role_id = jr.id) as applicant_count 
      FROM job_roles jr 
      WHERE jr.job_id IN (?)
    `, [jobIds]);

    // Group roles by job_id
    jobs.forEach(job => {
      job.roles = roles.filter(r => r.job_id === job.id).map(r => ({
        ...r,
        urgent_hiring: Boolean(r.urgent_hiring),
        requirements: typeof r.requirements === 'string' ? JSON.parse(r.requirements) : r.requirements,
        benefits: typeof r.benefits === 'string' ? JSON.parse(r.benefits) : r.benefits
      }));
      // Calculate total applications for the parent job
      job.applicant_count = job.roles.reduce((sum, role) => sum + role.applicant_count, 0);
    });

    return jobs;
  }

  static async findById(id) {
    const [jobs] = await pool.execute('SELECT * FROM jobs WHERE id = ?', [id]);
    if (jobs.length === 0) return null;
    
    const job = jobs[0];

    const [roles] = await pool.execute(`
      SELECT jr.*, 
        (SELECT COUNT(*) FROM applications WHERE role_id = jr.id) as applicant_count 
      FROM job_roles jr 
      WHERE jr.job_id = ?
    `, [id]);

    job.roles = roles.map(r => ({
      ...r,
      urgent_hiring: Boolean(r.urgent_hiring),
      requirements: typeof r.requirements === 'string' ? JSON.parse(r.requirements) : r.requirements,
      benefits: typeof r.benefits === 'string' ? JSON.parse(r.benefits) : r.benefits
    }));
    job.applicant_count = job.roles.reduce((sum, role) => sum + role.applicant_count, 0);

    return job;
  }

  static async create(jobData) {
    const { company, location, contact_number, whatsapp_number, status, roles } = jobData;
    
    const connection = await pool.getConnection();
    try {
      await connection.beginTransaction();

      const [jobResult] = await connection.execute(
        `INSERT INTO jobs (company, location, contact_number, whatsapp_number, status) 
         VALUES (?, ?, ?, ?, ?)`,
        [company, location, contact_number || '+919828377776', whatsapp_number || '919828377776', status || 'active']
      );
      
      const jobId = jobResult.insertId;

      if (roles && roles.length > 0) {
        for (const role of roles) {
          await connection.execute(
            `INSERT INTO job_roles (job_id, title, type, salary_min, salary_max, openings, shift, description, requirements, benefits, urgent_hiring, status) 
             VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            [
              jobId, 
              role.title, 
              role.type || 'Helper', 
              role.salary_min || 10000, 
              role.salary_max || 15000, 
              role.openings || 5, 
              role.shift || 'Day',
              role.description || '', 
              JSON.stringify(role.requirements || []), 
              JSON.stringify(role.benefits || []), 
              role.urgent_hiring ? 1 : 0, 
              role.status || 'active'
            ]
          );
        }
      }

      await connection.commit();
      return jobId;
    } catch (error) {
      await connection.rollback();
      throw error;
    } finally {
      connection.release();
    }
  }

  static async update(id, jobData) {
    const { company, location, contact_number, whatsapp_number, status, roles } = jobData;
    
    const connection = await pool.getConnection();
    try {
      await connection.beginTransaction();

      await connection.execute(
        `UPDATE jobs SET company = ?, location = ?, contact_number = ?, whatsapp_number = ?, status = ? WHERE id = ?`,
        [company, location, contact_number || '+919828377776', whatsapp_number || '919828377776', status, id]
      );
      
      // For simplicity on update, recreate all roles (or implement an upsert strategy)
      // We will delete existing roles and insert the new ones
      await connection.execute('DELETE FROM job_roles WHERE job_id = ?', [id]);
      
      if (roles && roles.length > 0) {
        for (const role of roles) {
          await connection.execute(
            `INSERT INTO job_roles (job_id, title, type, salary_min, salary_max, openings, shift, description, requirements, benefits, urgent_hiring, status) 
             VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            [
              id, 
              role.title, 
              role.type || 'Helper', 
              role.salary_min || 10000, 
              role.salary_max || 15000, 
              role.openings || 5, 
              role.shift || 'Day',
              role.description || '', 
              JSON.stringify(role.requirements || []), 
              JSON.stringify(role.benefits || []), 
              role.urgent_hiring ? 1 : 0, 
              role.status || 'active'
            ]
          );
        }
      }

      await connection.commit();
      return true;
    } catch (error) {
      await connection.rollback();
      throw error;
    } finally {
      connection.release();
    }
  }

  static async delete(id) {
    const [result] = await pool.execute('DELETE FROM jobs WHERE id = ?', [id]);
    return result.affectedRows > 0;
  }
}

export default JobModel;
