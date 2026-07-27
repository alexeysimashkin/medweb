import { NextResponse } from 'next/server';

// ВСЁ ВНУТРИ ОДНОГО ФАЙЛА
export async function POST(req) {
  try {
    const { fullName, email, password } = await req.json();
    
    // Просто возвращаем успех - база не нужна
    return NextResponse.json({ 
      success: true,
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
