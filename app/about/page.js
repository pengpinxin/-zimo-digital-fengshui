import React from 'react';
import Link from 'next/link';

export default function AboutPage() {
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
            Zi Mo Digital Feng Shui · 關於老師
          </span>
          <h1 className="text-3xl md:text-4xl font-bold tracking-wide">
            紫墨老師與家傳絕學
          </h1>
          <p className="text-gray-300 leading-relaxed text-sm md:text-base">
            十歲繼承家祖爺爺精準測字與數字風水絕學，秉持品質與專業，為高階需求者提供純粹的命理導引。
          </p>
        </header>

        <section className="space-y-6 text-gray-300 leading-relaxed text-sm md:text-base">
          <h2 className="text-xl font-semibold text-[#C59B27]">品牌理念與專業承諾</h2>
          <p>
            拒絕流水線式的泛用解答與繁雜流量競逐。紫墨數字風水專注於四大核心服務，以嚴謹的專業信譽，守護每一位追求人生質感與精準佈局的貴賓。
          </p>
        </section>

        <div className="border border-[#C59B27]/60 bg-[#1A110B]/80 p-8 rounded-lg text-center space-y-4">
          <h3 className="text-xl font-semibold text-[#F3EFEA]">展開您的專屬大運解析</h3>
          <div>
            <Link 
              href="/contact" 
              className="inline-block bg-[#C59B27] text-[#1A110B] font-bold px-8 py-3 rounded tracking-wider hover:bg-[#d4a72c] transition-colors"
            >
              立即預約諮詢
            </Link>
          </div>
        </div>

      </div>
    </main>
  );
}
