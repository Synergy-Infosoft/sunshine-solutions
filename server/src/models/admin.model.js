import pool from '../config/db.js';

class AdminModel {
  static async findByUsername(username) {
    const [rows] = await pool.execute('SELECT * FROM admin WHERE username = ?', [username]);
    return rows[0];
  }

  static async findById(id) {
    const [rows] = await pool.execute('SELECT id, username, created_at FROM admin WHERE id = ?', [id]);
    return rows[0];
  }
}

export default AdminModel;
