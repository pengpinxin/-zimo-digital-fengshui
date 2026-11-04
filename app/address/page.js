import React from 'react';
import Link from 'next/link';

export default function AddressPage() {
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
            Zi Mo Digital Feng Shui · 核心服務
          </span>
          <h1 className="text-3xl md:text-4xl font-bold tracking-wide">
            住址門牌選吉與居家磁場解析
          </h1>
          <p className="text-gray-300 leading-relaxed text-sm md:text-base">
            家是休養生息的避風港，門牌號碼的數字磁場直接影響居住者的運勢與安寧。為您的居家住址精準選吉，迎福納財。
          </p>
        </header>

        <section className="space-y-6 text-gray-300 leading-relaxed text-sm md:text-base">
          <h2 className="text-xl font-semibold text-[#C59B27]">為什麼需要住址門牌選吉？</h2>
          <p>
            門牌號碼帶有特定的空間磁場，與居住者密不可分。紫墨老師為您深度解析：
          </p>
          <ul className="list-disc pl-5 space-y-2 text-gray-300">
            <li><strong>居家安寧</strong>：過濾不良磁場，營造和諧溫馨的家庭氛圍。</li>
            <li><strong>聚氣納財</strong>：讓空間與大運緊密契合，提升整體家運。</li>
          </ul>
        </section>

        <div className="border border-[#C59B27]/60 bg-[#1A110B]/80 p-8 rounded-lg text-center space-y-4">
          <h3 className="text-xl font-semibold text-[#F3EFEA]">為您的居家空間打造專屬好磁場</h3>
          <div>
            <Link 
              href="/contact" 
              className="inline-block bg-[#C59B27] text-[#1A110B] font-bold px-8 py-3 rounded tracking-wider hover:bg-[#d4a72c] transition-colors"
            >
              立即預約住址選吉
            </Link>
          </div>
        </div>

      </div>
    </main>
  );
}
