import React from 'react';
import Link from 'next/link';

export default function PhonePage() {
  return (
    <main className="min-h-screen bg-[#1A110B] text-[#F3EFEA] px-6 py-12 md:py-20">
      <div className="max-w-3xl mx-auto space-y-8">
        
        {/* 返回首頁導覽 */}
        <div className="text-sm">
          <Link href="/" className="text-[#C59B27] hover:underline flex items-center gap-2">
            ← 返回紫墨數字風水首頁
          </Link>
        </div>

        {/* 標題區 */}
        <header className="border-b border-[#C59B27]/40 pb-6 space-y-3">
          <span className="text-xs uppercase tracking-widest text-[#C59B27] font-semibold">
            Zi Mo Digital Feng Shui · 核心服務
          </span>
          <h1 className="text-3xl md:text-4xl font-bold tracking-wide">
            手機號碼配置與磁場解析
          </h1>
          <p className="text-gray-300 leading-relaxed text-sm md:text-base">
            號碼隨身攜帶，其所產生的數字磁場無形中影響著您的事業判斷與財運流向。透過家傳精準數字風水，為您過濾凶煞、配置專屬吉號。
          </p>
        </header>

        {/* 核心內容區 */}
        <section className="space-y-6 text-gray-300 leading-relaxed text-sm md:text-base">
          <h2 className="text-xl font-semibold text-[#C59B27]">為什麼需要專業的手機號碼配置？</h2>
          <p>
            市面上常見的吉凶盲點往往只看末幾碼或諧音，忽略了整體號碼組合在八字大運中的磁場互動。紫墨老師結合十年深厚家傳學術底蘊，為您精準拆解號碼結構：
          </p>
          <ul className="list-disc pl-5 space-y-2 text-gray-300">
            <li><strong>避開破財與孤立磁場</strong>：找出隱藏在號碼中的無形漏財點。</li>
            <li><strong>強化貴人與事業磁場</strong>：對應您的本命八字，選出最具助力的高頻號碼。</li>
            <li><strong>量身訂製</strong>：根據您的現況與未來兩年大運需求進行全方位配置。</li>
          </ul>
        </section>

        {/* 預約與行動呼籲區 */}
        <div className="border border-[#C59B27]/60 bg-[#1A110B]/80 p-8 rounded-lg text-center space-y-4">
          <h3 className="text-xl font-semibold text-[#F3EFEA]">準備好為您的號碼迎來好磁場了嗎？</h3>
          <p className="text-sm text-gray-400">
            名額有限，採預約制精準親批，拒絕流水線式的泛用解答。
          </p>
          <div>
            <Link 
              href="/contact" 
              className="inline-block bg-[#C59B27] text-[#1A110B] font-bold px-8 py-3 rounded tracking-wider hover:bg-[#d4a72c] transition-colors"
            >
              立即預約專屬配置
            </Link>
          </div>
        </div>

      </div>
    </main>
  );
