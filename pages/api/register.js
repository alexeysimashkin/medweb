import '../../lib/initDb.js';
import { query } from '../../lib/db';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }
  
  try {
    const { fullName, email, password } = req.body;
    
    const existing = await query('SELECT id FROM doctors WHERE email = $1', [email]);
    if (existing.rows.length > 0) {
      return res.status(400).json({ error: 'Врач уже существует' });
    }

    const result = await query(
      'INSERT INTO doctors (full_name, email, password_hash) VALUES ($1, $2, $3) RETURNING id, full_name, email',
      [fullName, email, password]
    );

    res.status(200).json({ 
      success: true,
      message: 'Регистрация успешна!',
      doctor: result.rows[0]
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}
