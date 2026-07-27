import { NextResponse } from 'next/server';

// Экспортируем оба метода, но один принудительно динамический
export const dynamic = 'force-dynamic';

export async function GET() {
  return NextResponse.json({ 
    message: 'API работает!',
    time: new Date().toISOString()
  });
}
