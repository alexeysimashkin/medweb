import { query } from '../../lib/db';

export default async function handler(req, res) {
  try {
    const result = await query('SELECT NOW() as time');
    
    res.status(200).json({ 
      message: 'API работает!',
      time: result.rows[0].time,
      database: process.env.DATABASE_URL ? '✅ Подключена' : '❌ Нет подключения'
    });
  } catch (error) {
    res.status(500).json({ 
      message: 'Ошибка базы данных',
      error: error.message,
      database: process.env.DATABASE_URL ? '✅ Подключена' : '❌ Нет подключения'
    });
  }
}
