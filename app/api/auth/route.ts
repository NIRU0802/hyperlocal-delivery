import { NextResponse } from 'next/server';
import users from '@/components/data/users.json';

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export async function POST(request: Request) {
  await delay(300);
  
  const body = await request.json();
  const { email, password } = body;

  if (password !== '123456') {
    return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
  }

  const user = users.find(u => u.email === email);
  
  if (!user) {
    return NextResponse.json({ error: 'User not found' }, { status: 404 });
  }

  const { password: _, ...userWithoutPassword } = user as any;
  
  return NextResponse.json({
    user: userWithoutPassword,
    token: `mock_token_${Date.now()}`
  });
}
