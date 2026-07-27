import { query } from '@/lib/db';
import { comparePassword, signToken } from '@/lib/auth';
import { NextResponse } from 'next/server';

export async function POST(req) {
  try {
    const { email, password } = await req.json();
    const result = await query('SELECT * FROM doctors WHERE email = $1', [email]);
    
    if (result.rows.length === 0) {
      return NextResponse.json({ error: 'Врач не найден' }, { status: 401 });
    }

    const doctor = result.rows[0];
    if (!comparePassword(password, doctor.password_hash)) {
      return NextResponse.json({ error: 'Неверный пароль' }, { status: 401 });
    }

    const token = signToken(doctor.id, doctor.email);
    const response = NextResponse.json({ doctor: { id: doctor.id, full_name: doctor.full_name, email: doctor.email } });
    response.cookies.set('auth_token', token, { httpOnly: true, secure: true, path: '/' });
    return response;
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
