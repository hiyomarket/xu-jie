'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { apiClient } from '@/lib/api';

export default function RegisterPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (password !== confirmPassword) {
      setError('密碼與確認密碼不一致');
      return;
    }

    setLoading(true);

    try {
      const { data } = await apiClient.post('/auth/register', {
        email,
        username,
        password,
      });
      localStorage.setItem('accessToken', data.accessToken);
      router.push('/dashboard');
    } catch (err: any) {
      setError(err.response?.data?.error || '註冊失敗');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen flex items-center justify-center p-4">
      <div className="card-gold p-8 w-full max-w-md">
        <h1 className="text-3xl font-bold text-center text-gold-600 mb-8">註冊</h1>
        
        {error && (
          <div className="bg-red-50 text-red-600 p-3 rounded-lg mb-4 text-center">
            {error}
          </div>
        )}
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-gray-700 mb-2">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="input-gold w-full"
              required
            />
          </div>
          
          <div>
            <label className="block text-gray-700 mb-2">帳號</label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="input-gold w-full"
              required
              minLength={3}
            />
          </div>
          
          <div>
            <label className="block text-gray-700 mb-2">密碼</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="input-gold w-full"
              required
              minLength={6}
            />
          </div>
          
          <div>
            <label className="block text-gray-700 mb-2">確認密碼</label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="input-gold w-full"
              required
            />
          </div>
          
          <button
            type="submit"
            disabled={loading}
            className="btn-gold w-full py-3 disabled:opacity-50"
          >
            {loading ? '註冊中...' : '註冊'}
          </button>
        </form>
        
        <p className="text-center mt-6 text-gray-600">
          已有帳號？{' '}
          <Link href="/auth/login" className="text-gold-600 hover:underline">
            立即登入
          </Link>
        </p>
      </div>
    </main>
  );
}
