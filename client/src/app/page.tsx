import Link from 'next/link';

export default function Home() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center p-4">
      <div className="text-center max-w-2xl">
        {/* 遊戲標題 */}
        <h1 className="text-6xl font-bold text-gold-600 mb-4 drop-shadow-lg">
          墟界
        </h1>
        <p className="text-xl text-gray-600 mb-8">
          魔力寶貝風格半放置型網頁遊戲
        </p>
        
        {/* 四大元素 */}
        <div className="flex justify-center gap-4 mb-12">
          <div className="w-16 h-16 rounded-full bg-element-fire flex items-center justify-center text-white text-2xl font-bold shadow-lg">
            火
          </div>
          <div className="w-16 h-16 rounded-full bg-element-water flex items-center justify-center text-white text-2xl font-bold shadow-lg">
            水
          </div>
          <div className="w-16 h-16 rounded-full bg-element-earth flex items-center justify-center text-white text-2xl font-bold shadow-lg">
            地
          </div>
          <div className="w-16 h-16 rounded-full bg-element-wind flex items-center justify-center text-white text-2xl font-bold shadow-lg">
            風
          </div>
        </div>
        
        {/* 登入/註冊按鈕 */}
        <div className="flex gap-4 justify-center">
          <Link 
            href="/auth/login"
            className="btn-gold text-lg px-8 py-3"
          >
            登入
          </Link>
          <Link 
            href="/auth/register"
            className="bg-white border-2 border-gold-500 text-gold-600 hover:bg-gold-50 font-semibold py-3 px-8 rounded-lg transition-colors text-lg"
          >
            註冊
          </Link>
        </div>
        
        <p className="mt-8 text-gray-500 text-sm">
          © 2026 墟界 XuJie.io - All rights reserved.
        </p>
      </div>
    </main>
  );
}
