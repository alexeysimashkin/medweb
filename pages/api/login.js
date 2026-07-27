import '../../lib/initDb.js';
import { query } from '../../lib/db';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }
  
  try {
    const { email, password } = req.body;
    
    const result = await query('SELECT * FROM doctors WHERE email = $1', [email]);
    
    if (result.rows.length === 0) {
      return res.status(401).json({ error: 'Врач не найден' });
    }

    const doctor = result.rows[0];
    
    if (doctor.password_hash !== password) {
      return res.status(401).json({ error: 'Неверный пароль' });
    }

    res.status(200).json({ 
      success: true,
      message: 'Вход выполнен!',
      doctor: { 
        id: doctor.id, 
        full_name: doctor.full_name, 
        email: doctor.email 
      }
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}
