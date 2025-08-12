import { NextResponse } from 'next/server';
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

export async function GET() {
  try {
    // Get the auth token from cookies
    const authCookie = cookies().get('auth_token');
    
    if (!authCookie?.value) {
      return NextResponse.json({ user: null });
    }
    
    // Parse the token
    const { userId } = JSON.parse(authCookie.value);
    
    // Find the user (in a real app, this would query a database)
    const user = MOCK_USERS.find(u => u.id === userId);
    
    if (!user) {
      cookies().delete('auth_token');
      return NextResponse.json({ user: null });
    }
    
    // Return user data without password
    const userData = {
      id: user.id,
      username: user.username,
      email: user.email,
      avatar: user.avatar,
      role: user.role
    };
    
    return NextResponse.json({ user: userData });
  } catch (error) {
    console.error('Session error:', error);
    cookies().delete('auth_token');
    return NextResponse.json({ user: null });
  }
}