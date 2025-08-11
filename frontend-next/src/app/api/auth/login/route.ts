import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import jwt from 'jsonwebtoken';

// In a real application, you would use a database and proper password hashing
const MOCK_USERS = [
  {
    id: 'user-123',
    username: 'CommanderAlpha',
    email: 'user@example.com',
    password: 'password', // In a real app, this would be hashed
    avatar: 'https://via.placeholder.com/100',
    role: 'user'
  },
  {
    id: 'admin-456',
    username: 'AdminOverlord',
    email: 'admin@example.com',
    password: 'admin123', // In a real app, this would be hashed
    avatar: 'https://via.placeholder.com/100',
    role: 'admin'
  }
];

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json();

    // Validate input
    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email and password are required' },
        { status: 400 }
      );
    }

    // Find user (in a real app, this would query a database)
    const user = MOCK_USERS.find(u => u.email === email);

    // Check if user exists and password matches
    if (!user || user.password !== password) {
      return NextResponse.json(
        { error: 'Invalid email or password' },
        { status: 401 }
      );
    }

    // Create user data without password
    const userData = {
      id: user.id,
      username: user.username,
      email: user.email,
      avatar: user.avatar,
      role: user.role
    };

    // Set authentication cookie
    const oneWeek = 7 * 24 * 60 * 60 * 1000;
    const secret = process.env.JWT_SECRET;
    if (!secret) {
      console.error('JWT_SECRET is not set');
      return NextResponse.json(
        { error: 'Server misconfiguration: missing JWT secret' },
        { status: 500 }
      );
    }

    const token = jwt.sign(
      { sub: user.id, role: user.role },
      secret,
      {
        algorithm: 'HS256',
        expiresIn: '7d',
        issuer: 'crisis-unleashed',
        audience: 'crisis-unleashed-client',
      }
    );
    cookies().set({
      name: 'auth_token',
      value: token,
      httpOnly: true,
      path: '/',
      expires: Date.now() + oneWeek,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax'
    });

    return NextResponse.json({ user: userData });
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json(
      { error: 'Authentication failed' },
      { status: 500 }
    );
  }
}