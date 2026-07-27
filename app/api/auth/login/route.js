import { NextResponse } from 'next/server';

export async function POST(req) {
  try {
    const { email, password } = await req.json();
    
    return NextResponse.json({ 
      success: true,
      doctor: { 
        id: 1, 
        full_name: 'Test Doctor', 
        email: email || 'test@test.com' 
      }
    });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
