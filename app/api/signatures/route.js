import { query } from '@/lib/db';
import { NextResponse } from 'next/server';
import { verifyToken } from '@/lib/auth';
import { cookies } from 'next/headers';

// Получение активных подписей врача
export async function GET(req) {
  const cookieStore = cookies();
  const token = cookieStore.get('auth_token')?.value;
  const payload = verifyToken(token);
  if (!payload) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const result = await query(
    `SELECT * FROM digital_signatures WHERE doctor_id = $1 AND valid_to >= CURRENT_DATE ORDER BY valid_from DESC`,
    [payload.id]
  );
  return NextResponse.json(result.rows);
}

// Добавление новой ЭЦП
export async function POST(req) {
  try {
    const cookieStore = cookies();
    const token = cookieStore.get('auth_token')?.value;
    const payload = verifyToken(token);
    if (!payload) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const { keyIdentifier, ownerName, validFrom, validTo } = await req.json();

    const result = await query(
      `INSERT INTO digital_signatures (doctor_id, key_identifier, owner_name, valid_from, valid_to) 
       VALUES ($1, $2, $3, $4, $5) RETURNING *`,
      [payload.id, keyIdentifier, ownerName, validFrom, validTo]
    );
    return NextResponse.json(result.rows[0]);
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
