import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import User from '@/lib/models/user';
import bcrypt from 'bcrypt';

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

    // Create session data
    const sessionData = {
      userId: user._id.toString(),
      role: user.role,
      email: user.email
    };

    // Create the response with the appropriate headers
    const response = new NextResponse(
      JSON.stringify({
        message: 'Login successful',
        user: {
          email: user.email,
          role: user.role
        },
        redirectUrl: user.role === 'admin' ? '/admin' : '/dashboard'
      }),
      {
        status: 200,
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );

    // Set the cookie in the response
    response.cookies.set({
      name: 'session',
      value: JSON.stringify(sessionData),
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 3600,
      path: '/',
    });

    console.log('Set session cookie:', sessionData); // Debug log
    return response;

  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}