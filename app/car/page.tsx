import React from 'react';
import Link from 'next/link';

export default function CarPage() {
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
            車牌號碼吉凶與磁場解析
          </h1>
          <p className="text-gray-300 leading-relaxed text-sm md:text-base">
            行車安全與出行磁場息息相關。為您的愛車配置專屬吉號，避開潛在煞氣，一路平安順遂。
          </p>
        </header>

        <section className="space-y-6 text-gray-300 leading-relaxed text-sm md:text-base">
          <h2 className="text-xl font-semibold text-[#C59B27]">為什麼需要專業車牌數字配置？</h2>
          <p>
            車牌不僅是身分識別，更是移動中的能量場。紫墨老師結合家傳精準學術，為您過濾不吉組合：
          </p>
          <ul className="list-disc pl-5 space-y-2 text-gray-300">
            <li><strong>行車平安</strong>：避開容易引發意外與碰撞的負面磁場。</li>
            <li><strong>出行順遂</strong>：增強貴人與穩定磁場，事業通勤一路暢通。</li>
          </ul>
        </section>

        <div className="border border-[#C59B27]/60 bg-[#1A110B]/80 p-8 rounded-lg text-center space-y-4">
          <h3 className="text-xl font-semibold text-[#F3EFEA]">為您的愛車配置最佳磁場</h3>
          <div>
            <Link 
              href="/contact" 
              className="inline-block bg-[#C59B27] text-[#1A110B] font-bold px-8 py-3 rounded tracking-wider hover:bg-[#d4a72c] transition-colors"
            >
              立即預約車牌配置
            </Link>
          </div>
        </div>

      </div>
    </main>
  );
}
