import React from 'react';
import Link from 'next/link';

export default function ContactPage() {
  return (
    <main className="min-h-screen bg-[#1A110B] text-[#F3EFEA] px-6 py-12 md:py-20">
      <div className="max-w-3xl mx-auto space-y-8">
        
        <div className="text-sm">
          <Link href="/" className="text-[#C59B27] hover:underline flex items-center gap-2">
            ← 返回紫墨數字風水首頁
          </Link>
        </div>

        <header className="border-b border-[#C59B27]/40 pb-6 space-y-3">
          <span className="text-xs uppercase tracking-widest text-[#C59B27] font-semibold">
            Zi Mo Digital Feng Shui · 立即預約
          </span>
          <h1 className="text-3xl md:text-4xl font-bold tracking-wide">
            預約專屬諮詢與聯絡方式
          </h1>
          <p className="text-gray-300 leading-relaxed text-sm md:text-base">
            開啟您的精準磁場配置與流年大運解析。歡迎透過官方管道與我們聯繫。
          </p>
        </header>

        <section className="space-y-6 text-gray-300 leading-relaxed text-sm md:text-base">
          <h2 className="text-xl font-semibold text-[#C59B27]">官方聯絡資訊</h2>
          <p>
            為確保每位貴賓都能獲得最嚴謹、專屬的親批服務，請透過以下官方管道：
          </p>
          <div className="bg-[#1A110B] border border-[#C59B27]/40 p-6 rounded-lg space-y-3">
            <p><strong>官方電子信箱：</strong> Aaa0987955906aaa@gmail.com</p>
            <p><strong>四大核心服務：</strong> 手機號碼配置、車牌號碼吉凶、住址門牌選吉、店鋪門牌選吉。</p>
          </div>
        </section>

        <div className="border border-[#C59B27]/60 bg-[#1A110B]/80 p-8 rounded-lg text-center space-y-4">
          <h3 className="text-xl font-semibold text-[#F3EFEA]">邁向精準佈局的下一步</h3>
          <p className="text-sm text-gray-400">
            大道至誠，為您把關每一個磁場細節。
          </p>
        </div>

      </div>
    </main>
  );
}
