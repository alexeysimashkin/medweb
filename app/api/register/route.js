import { NextResponse } from 'next/server';

export async function POST(req) {
  try {
    const { fullName, email, password } = await req.json();
    
    return NextResponse.json({ 
      success: true,
      message: 'Регистрация успешна!',
      doctor: { 
        id: 1, 
        full_name: fullName || 'Test Doctor', 
        email: email || 'test@test.com' 
      }
    });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
