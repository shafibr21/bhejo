'use client';

import { useState } from 'react';
import { register } from '@/services/authService';
import { useRouter } from 'next/navigation';
import type { RegisterPayload } from '@/types/user';

    
export default function RegisterPage() {
  const [form, setForm] = useState<RegisterPayload>({
    name: '',
    email: '',
    password: '',
    role: 'customer',
  });

  const router = useRouter();

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const res = await register(form);
    if (res.message) {
      alert('Registered successfully');
      router.push('/auth/login');
    } else {
      alert(res.error || 'Register failed');
    }
  }

  return (
    <div className="max-w-md mx-auto p-4">
      <h1 className="text-xl font-semibold mb-4">Register</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input name="name" value={form.name} onChange={handleChange} placeholder="Name" className="w-full p-2 border" required />
        <input type="email" name="email" value={form.email} onChange={handleChange} placeholder="Email" className="w-full p-2 border" required />
        <input type="password" name="password" value={form.password} onChange={handleChange} placeholder="Password" className="w-full p-2 border" required />
        <select name="role" value={form.role} onChange={handleChange} className="w-full p-2 border">
          <option value="customer">Customer</option>
          <option value="agent">Agent</option>
          <option value="admin">Admin</option>
        </select>
        <button type="submit" className="bg-black text-white px-4 py-2 w-full">Register</button>
      </form>
    </div>
  );
}