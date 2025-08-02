'use client';

import { useState } from 'react';
import { login } from '@/services/authService';
import { useAuth } from '@/hooks/useAuth';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { setUser, setToken } = useAuth();
  const router = useRouter();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const res = await login({ email, password });
    if (res.token) {
      setToken(res.token);
      setUser(res.user);
      router.push(`/${res.user.role}/dashboard`);
    } else {
      alert(res.error || 'Login failed');
    }
  }

  return (
    <div className="max-w-md mx-auto p-4">
      <h1 className="text-xl font-semibold mb-4">Login</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="Email" className="w-full p-2 border" required />
        <input type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="Password" className="w-full p-2 border" required />
        <button type="submit" className="bg-black text-white px-4 py-2 w-full">Login</button>
      </form>
    </div>
  );
}