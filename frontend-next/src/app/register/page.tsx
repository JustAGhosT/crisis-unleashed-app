import { RegisterForm } from '@/components/auth/RegisterForm';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Register | Crisis Unleashed',
  description: 'Create your Crisis Unleashed account',
};

export default function RegisterPage() {
  return (
    <div className="container max-w-4xl py-12">
      <h1 className="text-3xl font-bold text-center mb-8 text-white">Join Crisis Unleashed</h1>
      <RegisterForm />
    </div>
  );
}