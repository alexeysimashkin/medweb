import { Pool } from 'pg';

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false,
  },
});

export async function query(text, params) {
  const start = Date.now();
  const res = await pool.query(text, params);
  const duration = Date.now() - start;
  console.log('Executed query', { text, duration, rows: res.rowCount });
  return res;
}

// Автоматическая инициализация таблиц при первом подключении
export async function initDatabase() {
  try {
    console.log('🔄 Инициализация базы данных...');

    // Таблица врачей
    await query(`
      CREATE TABLE IF NOT EXISTS doctors (
        id SERIAL PRIMARY KEY,
        full_name VARCHAR(255) NOT NULL,
        specialization VARCHAR(255),
        email VARCHAR(255) UNIQUE NOT NULL,
        password_hash TEXT NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Таблица пациентов
    await query(`
      CREATE TABLE IF NOT EXISTS patients (
        id SERIAL PRIMARY KEY,
        full_name VARCHAR(255) NOT NULL,
        card_number VARCHAR(50) UNIQUE NOT NULL,
        gender VARCHAR(10) CHECK (gender IN ('Male', 'Female', 'Other')),
        birth_date DATE,
        phone VARCHAR(20),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Таблица ЭЦП
    await query(`
      CREATE TABLE IF NOT EXISTS digital_signatures (
        id SERIAL PRIMARY KEY,
        doctor_id INTEGER REFERENCES doctors(id) ON DELETE CASCADE,
        key_identifier TEXT NOT NULL,
        owner_name VARCHAR(255) NOT NULL,
        valid_from DATE NOT NULL,
        valid_to DATE NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Таблица приемов
    await query(`
      CREATE TABLE IF NOT EXISTS appointments (
        id SERIAL PRIMARY KEY,
        doctor_id INTEGER REFERENCES doctors(id) ON DELETE CASCADE,
        patient_id INTEGER REFERENCES patients(id) ON DELETE CASCADE,
        appointment_datetime TIMESTAMP NOT NULL,
        complaints TEXT,
        anamnesis TEXT,
        objective_status TEXT,
        recommendations TEXT,
        diagnosis_code VARCHAR(20),
        diagnosis_text TEXT,
        is_signed BOOLEAN DEFAULT FALSE,
        signature_id INTEGER REFERENCES digital_signatures(id) ON DELETE SET NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Индексы
    await query(`
      CREATE INDEX IF NOT EXISTS idx_appointments_doctor ON appointments(doctor_id);
      CREATE INDEX IF NOT EXISTS idx_appointments_datetime ON appointments(appointment_datetime);
      CREATE INDEX IF NOT EXISTS idx_patients_card ON patients(card_number);
      CREATE INDEX IF NOT EXISTS idx_patients_name ON patients(full_name);
    `);

    console.log('✅ База данных инициализирована');
    return true;
  } catch (error) {
    console.error('❌ Ошибка инициализации:', error.message);
    throw error;
  }
}

// Вызываем инициализацию при первом импорте
initDatabase().catch(console.error);

export default pool;
