import { NextResponse } from 'next/server';

export async function POST(req) {
  try {
    const url = new URL(req.url);
    const path = url.pathname;
    const body = await req.json();
    
    // Регистрация через /api?action=register
    if (path === '/api' && body.action === 'register') {
      return NextResponse.json({ 
        success: true,
        message: 'Регистрация успешна!',
        doctor: { 
          id: 1, 
          full_name: body.fullName || 'Test Doctor', 
          email: body.email || 'test@test.com' 
        }
      });
    }
    
    // Логин через /api?action=login
    if (path === '/api' && body.action === 'login') {
      return NextResponse.json({ 
        success: true,
        message: 'Вход выполнен!',
        doctor: { 
          id: 1, 
          full_name: 'Test Doctor', 
          email: body.email || 'test@test.com' 
        }
      });
    }
    
    return NextResponse.json({ error: 'Unknown action' }, { status: 400 });
    
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// Для GET запросов - проверка работы
export async function GET() {
  return NextResponse.json({ 
    message: 'API работает!', 
    time: new Date().toISOString() 
  });
}
