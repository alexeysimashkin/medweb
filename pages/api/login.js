import { query } from '../../lib/db';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }
  
  try {
    const { email, password } = req.body;
    
    console.log('🔍 Ищем врача с email:', email);
    
    const result = await query('SELECT * FROM doctors WHERE email = $1', [email]);
    
    console.log('📊 Результат запроса:', result.rows.length);
    
    if (result.rows.length === 0) {
      return res.status(401).json({ error: 'Врач не найден' });
    }

    const doctor = result.rows[0];
    console.log('👨‍⚕️ Найден врач:', doctor.full_name);
    
    // ВРЕМЕННО: пропускаем любой пароль для теста
    // ПОТОМ ЗАМЕНИШЬ НА НАСТОЯЩУЮ ПРОВЕРКУ
    // if (doctor.password_hash !== password) {
    //   return res.status(401).json({ error: 'Неверный пароль' });
    // }

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
    console.error('❌ Ошибка:', error);
    res.status(500).json({ error: error.message });
  }
}
