import { verifyToken } from '@/lib/auth';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';
import { query } from '@/lib/db';

export async function GET() {
  const cookieStore = cookies();
  const token = cookieStore.get('auth_token')?.value;
  if (!token) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  
  const payload = verifyToken(token);
  if (!payload) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const result = await query('SELECT id, full_name, specialization, email FROM doctors WHERE id = $1', [payload.id]);
  if (result.rows.length === 0) return NextResponse.json({ error: 'Not found' }, { status: 404 });
  
  return NextResponse.json({ doctor: result.rows[0] });
}
