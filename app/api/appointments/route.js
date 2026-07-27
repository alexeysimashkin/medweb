import { query } from '@/lib/db';
import { NextResponse } from 'next/server';
import { verifyToken } from '@/lib/auth';
import { cookies } from 'next/headers';

// Получение списка приемов для врача
export async function GET(req) {
  const cookieStore = cookies();
  const token = cookieStore.get('auth_token')?.value;
  const payload = verifyToken(token);
  if (!payload) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const result = await query(
    `SELECT a.*, p.full_name as patient_name, p.card_number, 
            s.owner_name as signature_owner, s.valid_to
     FROM appointments a
     JOIN patients p ON a.patient_id = p.id
     LEFT JOIN digital_signatures s ON a.signature_id = s.id
     WHERE a.doctor_id = $1
     ORDER BY a.appointment_datetime DESC`,
    [payload.id]
  );
  return NextResponse.json(result.rows);
}

// Создание нового приема
export async function POST(req) {
  try {
    const cookieStore = cookies();
    const token = cookieStore.get('auth_token')?.value;
    const payload = verifyToken(token);
    if (!payload) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const body = await req.json();
    const { 
      patientId, 
      appointmentDateTime, 
      complaints, 
      anamnesis, 
      objectiveStatus, 
      recommendations,
      diagnosisCode,
      diagnosisText,
      signatureId 
    } = body;

    // Проверяем, что пациент существует
    const patientCheck = await query('SELECT id FROM patients WHERE id = $1', [patientId]);
    if (patientCheck.rows.length === 0) {
      return NextResponse.json({ error: 'Пациент не найден' }, { status: 404 });
    }

    const result = await query(
      `INSERT INTO appointments (
        doctor_id, patient_id, appointment_datetime, 
        complaints, anamnesis, objective_status, 
        recommendations, diagnosis_code, diagnosis_text,
        signature_id, is_signed
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11) RETURNING *`,
      [
        payload.id, patientId, appointmentDateTime,
        complaints, anamnesis, objectiveStatus,
        recommendations, diagnosisCode, diagnosisText,
        signatureId || null, 
        !!signatureId // Если передан signatureId, ставим is_signed = true
      ]
    );

    return NextResponse.json(result.rows[0]);
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
