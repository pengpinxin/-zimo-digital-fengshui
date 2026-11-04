import React from 'react';
import Link from 'next/link';

export default function StorePage() {
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
            店鋪門牌選吉與商業磁場解析
          </h1>
          <p className="text-gray-300 leading-relaxed text-sm md:text-base">
            店鋪門面與地址數字直接牽動生意客源與財運流向。為您的事業據點精準選吉，迎八方財氣。
          </p>
        </header>

        <section className="space-y-6 text-gray-300 leading-relaxed text-sm md:text-base">
          <h2 className="text-xl font-semibold text-[#C59B27]">為什麼需要店鋪門牌選吉？</h2>
          <p>
            商業空間的數字磁場影響著客戶意向與經營順暢度。紫墨老師為您專業評估：
          </p>
          <ul className="list-disc pl-5 space-y-2 text-gray-300">
            <li><strong>客源匯聚</strong>：避開冷清磁場，吸引源源不絕的客流與貴人。</li>
            <li><strong>財運亨通</strong>：讓店鋪數字與經營大運相輔相成，穩健營利。</li>
          </ul>
        </section>

        <div className="border border-[#C59B27]/60 bg-[#1A110B]/80 p-8 rounded-lg text-center space-y-4">
          <h3 className="text-xl font-semibold text-[#F3EFEA]">為您的店鋪打造聚財好磁場</h3>
          <div>
            <Link 
              href="/contact" 
              className="inline-block bg-[#C59B27] text-[#1A110B] font-bold px-8 py-3 rounded tracking-wider hover:bg-[#d4a72c] transition-colors"
            >
              立即預約店鋪選吉
            </Link>
          </div>
        </div>

      </div>
    </main>
  );
}
