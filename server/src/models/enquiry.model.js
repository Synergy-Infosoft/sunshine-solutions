import pool from '../config/db.js';

class EnquiryModel {
  static async create(enquiryData) {
    const { name, phone, message, type, status } = enquiryData;
    
    const [result] = await pool.execute(
      `INSERT INTO enquiries (name, phone, message, type, status) 
       VALUES (?, ?, ?, ?, ?)`,
      [name, phone, message, type || 'GENERAL', status || 'new']
    );
    
    return result.insertId;
  }

  static async findAll() {
    const [rows] = await pool.execute('SELECT * FROM enquiries ORDER BY created_at DESC');
    return rows;
  }
}

export default EnquiryModel;
