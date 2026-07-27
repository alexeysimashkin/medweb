import { NextResponse } from 'next/server';

// Это для POST запросов на /api/auth
export async function POST(req) {
  try {
    const body = await req.json();
    const { action, email, password, fullName } = body;
    
    // Регистрация
    if (action === 'register') {
      return NextResponse.json({ 
        success: true,
        doctor: { 
          id: 1, 
          full_name: fullName || 'Test Doctor', 
          email: email || 'test@test.com' 
        }
      });
    }
    
    // Логин
    if (action === 'login') {
      return NextResponse.json({ 
        success: true,
        doctor: { 
          id: 1, 
          full_name: 'Test Doctor', 
          email: email || 'test@test.com' 
        }
      });
    }
    
    return NextResponse.json({ error: 'Unknown action' }, { status: 400 });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
