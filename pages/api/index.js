import { query } from '../../lib/db';

export default async function handler(req, res) {
  // Если GET - проверяем базу
  if (req.method === 'GET') {
    try {
      const result = await query('SELECT NOW() as time');
      res.status(200).json({ 
        message: 'API работает!',
        time: result.rows[0].time,
        database: process.env.DATABASE_URL ? '✅ Подключена' : '❌ Нет подключения'
      });
    } catch (error) {
      res.status(500).json({ 
        error: error.message,
        database: process.env.DATABASE_URL ? '✅ Подключена' : '❌ Нет подключения'
      });
    }
    return;
  }

  // Если POST - обрабатываем регистрацию или вход
  if (req.method === 'POST') {
    const { action, fullName, email, password } = req.body;

    // РЕГИСТРАЦИЯ
    if (action === 'register') {
      try {
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
      return;
    }

    // ВХОД
    if (action === 'login') {
      try {
        const result = await query('SELECT * FROM doctors WHERE email = $1', [email]);
        
        if (result.rows.length === 0) {
          return res.status(401).json({ error: 'Врач не найден' });
        }

        const doctor = result.rows[0];
        
        // ВРЕМЕННО: пропускаем пароль
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
      return;
    }

    res.status(400).json({ error: 'Неизвестное действие' });
  }
}
