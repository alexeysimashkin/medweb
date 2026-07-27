import { query } from '../../lib/db';

export default async function handler(req, res) {
  try {
    // Проверяем, есть ли таблицы
    const result = await query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public'
    `);
    
    res.status(200).json({ 
      tables: result.rows,
      database: process.env.DATABASE_URL ? '✅ Подключена' : '❌ Нет подключения'
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}
