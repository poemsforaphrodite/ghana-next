import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import User from '@/lib/models/user';
import bcrypt from 'bcrypt';
import { cookies } from 'next/headers';

export async function POST(request: Request) {
  console.log('Login route hit');
  try {
    const { email, password } = await request.json();
    console.log('Received login request for email:', email);

    if (!email || !password) {
      console.log('Missing email or password');
      return NextResponse.json({ message: 'Missing email or password' }, { status: 400 });
    }

    await dbConnect();
    console.log('Connected to database');

    const user = await User.findOne({ email });
    if (!user) {
      console.log('User not found');
      return NextResponse.json({ message: 'User not found' }, { status: 404 });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      console.log('Invalid password');
      return NextResponse.json({ message: 'Invalid password' }, { status: 401 });
    }

    console.log('Login successful');
    console.log('User role:', user.role);

    // Set a session cookie
    cookies().set('session', JSON.stringify({ userId: user._id, role: user.role }), {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 3600, // 1 hour
      path: '/',
    });

    const redirectUrl = user.role === 'admin' ? '/admin' : '/dashboard';

    return NextResponse.json({ 
      message: 'Login successful',
      user: {
        email: user.email,
        role: user.role
      },
      redirectUrl
    }, { status: 200 });
  } catch (error: unknown) {
    console.error('Login Error:', error);
    return NextResponse.json({ 
      message: 'Internal server error', 
      error: error instanceof Error ? error.message : String(error) 
    }, { status: 500 });
  }
}