import { NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';

export async function POST(req: Request) {
  const { email, password } = await req.json();

  if (email !== process.env.ADMIN_EMAIL || password !== process.env.ADMIN_PASSWORD) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const token = jwt.sign({ admin: true }, process.env.ADMIN_JWT_SECRET!, { expiresIn: '7d' });

  const res = NextResponse.json({ success: true, token: token }, { status: 200 });
  res.cookies.set('admin_session', token, {
    httpOnly: true,
    secure: true,
    sameSite: 'strict',
    path: '/',
  });

  return res;
}
