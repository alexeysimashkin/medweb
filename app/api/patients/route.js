import { query } from '@/lib/db';
import { NextResponse } from 'next/server';

export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const queryParam = searchParams.get('q');
  
  if (!queryParam) {
    return NextResponse.json([]);
  }

  const result = await query(
    `SELECT id, full_name, card_number, gender FROM patients 
     WHERE full_name ILIKE $1 OR card_number ILIKE $1 LIMIT 10`,
    [`%${queryParam}%`]
  );
  return NextResponse.json(result.rows);
}

export async function POST(req) {
  try {
    const { fullName, cardNumber, gender, birthDate, phone } = await req.json();
    
    // Проверка уникальности карты
    const existing = await query('SELECT id FROM patients WHERE card_number = $1', [cardNumber]);
    if (existing.rows.length > 0) {
      return NextResponse.json({ error: 'Номер карты уже существует' }, { status: 400 });
    }

    const result = await query(
      `INSERT INTO patients (full_name, card_number, gender, birth_date, phone) 
       VALUES ($1, $2, $3, $4, $5) RETURNING *`,
      [fullName, cardNumber, gender, birthDate, phone]
    );
    return NextResponse.json(result.rows[0]);
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
