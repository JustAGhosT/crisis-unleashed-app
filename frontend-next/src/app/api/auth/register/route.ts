import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';

// In a real application, this would be stored in a database
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
    const { username, email, password } = await request.json();

    // Validate input
    if (!username || !email || !password) {
      return NextResponse.json(
        { error: 'Username, email, and password are required' },
        { status: 400 }
      );
    }

    // Check if email is already in use
    if (MOCK_USERS.some(u => u.email === email)) {
      return NextResponse.json(
        { error: 'Email already in use' },
        { status: 409 }
      );
    }

    // Check if username is already taken
    if (MOCK_USERS.some(u => u.username === username)) {
      return NextResponse.json(
        { error: 'Username already taken' },
        { status: 409 }
      );
    }

    // Create new user
    const newUser = {
      id: `user-${Date.now()}`,
      username,
      email,
      password, // In a real app, this would be hashed
      avatar: 'https://via.placeholder.com/100',
      role: 'user'
    };

    // Add to mock database
    MOCK_USERS.push(newUser);

    // Create user data without password
    const userData = {
      id: newUser.id,
      username: newUser.username,
      email: newUser.email,
      avatar: newUser.avatar,
      role: newUser.role
    };

    // Set authentication cookie
    const oneWeek = 7 * 24 * 60 * 60 * 1000;
    cookies().set({
      name: 'auth_token',
      value: JSON.stringify({ userId: newUser.id, role: newUser.role }),
      httpOnly: true,
      path: '/',
      expires: Date.now() + oneWeek,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax'
    });

    return NextResponse.json({ user: userData });
  } catch (error) {
    console.error('Registration error:', error);
    return NextResponse.json(
      { error: 'Registration failed' },
      { status: 500 }
    );
  }
}