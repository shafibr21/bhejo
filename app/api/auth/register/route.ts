import { NextRequest, NextResponse } from 'next/server';
import { connectToDB } from '@/lib/mongodb';
import User from '@/models/userModel';
import bcrypt from 'bcryptjs';

export async function POST(req: NextRequest) {
  const { name, email, password, role } = await req.json();
  await connectToDB();

  const existing = await User.findOne({ email });
  if (existing) return NextResponse.json({ error: 'Email already in use' }, { status: 400 });

  const hashedPassword = await bcrypt.hash(password, 10);
  const user = await User.create({ name, email, password: hashedPassword, role });

  return NextResponse.json({ message: 'User created successfully' });
}
