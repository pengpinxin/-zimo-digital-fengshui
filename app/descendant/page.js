import React from 'react';
import Link from 'next/link';

export default function DescendantBookPage() {
  return (
    <main className="min-h-screen bg-[#1A110B] text-[#F3EFEA] px-6 py-12 md:py-20">
      <div className="max-w-3xl mx-auto space-y-8">
        
        {/* 返回首頁導覽 */}
        <div className="text-sm">
          <Link href="/" className="text-[#C59B27] hover:underline flex items-center gap-2">
            ← 返回紫墨數字風水與品心書閣首頁
          </Link>
        </div>

        {/* 標題與介紹區 */}
        <header className="border-b border-[#C59B27]/40 pb-6 space-y-3">
          <span className="text-xs uppercase tracking-widest text-[#C59B27] font-semibold">
            彭品心 · 學術文學創作
          </span>
          <h1 className="text-3xl md:text-4xl font-bold tracking-wide">
            《進階思維的後裔》
          </h1>
          <p className="text-gray-300 leading-relaxed text-sm md:text-base">
            突破既有框架，探索思維演化的深層境界。彭品心老師透過宏觀的視角與細膩的筆觸，帶領讀者站在更高的思維維度，重新審視個人成長、命理哲學與時代的脈動。
          </p>
        </header>

        {/* 核心內容區 */}
        <section className="space-y-6 text-gray-300 leading-relaxed text-sm md:text-base">
          <h2 className="text-xl font-semibold text-[#C59B27]">思維升級的鑰匙</h2>
          <p>
            這是一部結合理性哲思與靈性啟發的深度著作，專為追求心靈突破與深度思維的讀者而寫：
          </p>
          <ul className="list-disc pl-5 space-y-2 text-gray-300">
            <li><strong>框架打破</strong>：跳脫傳統思維慣性，建立全方位的立體視角。</li>
            <li><strong>深度解構</strong>：結合命理哲學與現代思維，洞察事物本質。</li>
            <li><strong>前瞻視野</strong>：引領您在變動的時代中，掌握內在的定位與方向。</li>
          </ul>
        </section>

        {/* 預約與行動呼籲區 */}
        <div className="border border-[#C59B27]/60 bg-[#1A110B]/80 p-8 rounded-lg text-center space-y-4">
          <h3 className="text-xl font-semibold text-[#F3EFEA]">探索《進階思維的後裔》</h3>
          <p className="text-sm text-gray-400">
            品心書閣官方授權發行，開啟您的進階思維之旅。
          </p>
          <div>
            <Link 
              href="/contact" 
              className="inline-block bg-[#C59B27] text-[#1A110B] font-bold px-8 py-3 rounded tracking-wider hover:bg-[#d4a72c] transition-colors"
            >
              立即聯繫購買
            </Link>
          </div>
        </div>

      </div>
    </main>
  );
}
