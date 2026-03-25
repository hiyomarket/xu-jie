'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { apiClient } from '@/lib/api';

interface User {
  id: number;
  username: string;
  gold: number;
  level: number;
  exp: number;
}

interface Pet {
  id: number;
  name: string;
  level: number;
  hp: number;
  hpMax: number;
}

export default function DashboardPage() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [pets, setPets] = useState<Pet[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('accessToken');
    if (!token) {
      router.push('/auth/login');
      return;
    }

    apiClient.get('/user/profile')
      .then(({ data }) => {
        setUser({
          id: data.id,
          username: data.username,
          gold: data.gold,
          level: data.level,
          exp: data.exp,
        });
        setPets(data.pets || []);
      })
      .catch(() => {
        localStorage.removeItem('accessToken');
        router.push('/auth/login');
      })
      .finally(() => setLoading(false));
  }, [router]);

  const handleLogout = async () => {
    try {
      await apiClient.post('/auth/logout');
    } finally {
      localStorage.removeItem('accessToken');
      router.push('/');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-gold-600 text-xl">載入中...</div>
      </div>
    );
  }

  return (
    <main className="min-h-screen p-4">
      <div className="max-w-4xl mx-auto">
        {/* 頂部資訊欄 */}
        <div className="card-gold p-4 mb-6 flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gold-600">{user?.username}</h1>
            <div className="flex gap-4 mt-2 text-gray-600">
              <span>Lv.{user?.level}</span>
              <span>💰 {user?.gold}</span>
              <span>EXP: {user?.exp}</span>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="text-gray-500 hover:text-red-500"
          >
            登出
          </button>
        </div>

        {/* 主選單 */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <Link href="/game/battle" className="card-gold p-6 text-center hover:shadow-xl transition-shadow">
            <div className="text-4xl mb-2">⚔️</div>
            <div className="font-semibold text-gray-700">戰鬥</div>
          </Link>
          <Link href="/game/pets" className="card-gold p-6 text-center hover:shadow-xl transition-shadow">
            <div className="text-4xl mb-2">🐾</div>
            <div className="font-semibold text-gray-700">寵物</div>
          </Link>
          <Link href="/game/gacha" className="card-gold p-6 text-center hover:shadow-xl transition-shadow">
            <div className="text-4xl mb-2">🎰</div>
            <div className="font-semibold text-gray-700">抽卡</div>
          </Link>
          <Link href="/game/shop" className="card-gold p-6 text-center hover:shadow-xl transition-shadow">
            <div className="text-4xl mb-2">🏪</div>
            <div className="font-semibold text-gray-700">商店</div>
          </Link>
        </div>

        {/* 寵物列表 */}
        <div className="card-gold p-6">
          <h2 className="text-xl font-bold text-gray-700 mb-4">我的寵物</h2>
          {pets.length === 0 ? (
            <div className="text-center text-gray-500 py-8">
              還沒有寵物，去捕捉一隻吧！
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {pets.map((pet) => (
                <div key={pet.id} className="border-2 border-gold-200 rounded-lg p-4">
                  <div className="font-semibold">{pet.name}</div>
                  <div className="text-sm text-gray-500">Lv.{pet.level}</div>
                  <div className="mt-2">
                    <div className="text-red-500">HP: {pet.hp}/{pet.hpMax}</div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
