import { query } from '../../../lib/db';
import { hashPassword, signToken } from '../../../lib/auth';
import { NextResponse } from 'next/server';

export async function POST(req) {
  try {
    const { fullName, specialization, email, password } = await req.json();
    
    const existing = await query('SELECT id FROM doctors WHERE email = $1', [email]);
    if (existing.rows.length > 0) {
      return NextResponse.json({ error: 'Врач уже существует' }, { status: 400 });
    }

    const hashed = hashPassword(password);
    const result = await query(
      'INSERT INTO doctors (full_name, specialization, email, password_hash) VALUES ($1, $2, $3, $4) RETURNING id, full_name, email',
      [fullName, specialization, email, hashed]
    );

    const doctor = result.rows[0];
    const token = signToken(doctor.id, doctor.email);

    const response = NextResponse.json({ doctor, token });
    response.cookies.set('auth_token', token, { httpOnly: true, secure: true, path: '/' });
    return response;
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
