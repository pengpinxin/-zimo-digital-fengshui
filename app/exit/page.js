import React from 'react';
import Link from 'next/link';

export default function ExitBookPage() {
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
            彭品心 · 思想文學創作
          </span>
          <h1 className="text-3xl md:text-4xl font-bold tracking-wide">
            《生命的出口》
          </h1>
          <p className="text-gray-300 leading-relaxed text-sm md:text-base">
            在紛擾的現代思維中，為心靈尋找一方清靜的出口。彭品心老師透過深刻的文字與哲學思辨，引領讀者在困境與轉折中沉澱，觀照自我、重獲內在的平靜與力量。
          </p>
        </header>

        {/* 核心內容區 */}
        <section className="space-y-6 text-gray-300 leading-relaxed text-sm md:text-base">
          <h2 className="text-xl font-semibold text-[#C59B27]">書籍核心價值</h2>
          <p>
            本書融合了東方禪意與現代人本反思，直面生命本質的深刻對話：
          </p>
          <ul className="list-disc pl-5 space-y-2 text-gray-300">
            <li><strong>內在覺察</strong>：學會在喧囂中與自己對話，看清盲點。</li>
            <li><strong>轉念智慧</strong>：在生命的出口處，將困境化為向內探索的契機。</li>
            <li><strong>心靈沈澱</strong>：賦予讀者安頓身心的力量與平靜。</li>
          </ul>
        </section>

        {/* 預約與行動呼籲區 */}
        <div className="border border-[#C59B27]/60 bg-[#1A110B]/80 p-8 rounded-lg text-center space-y-4">
          <h3 className="text-xl font-semibold text-[#F3EFEA]">收藏《生命的出口》</h3>
          <p className="text-sm text-gray-400">
            品心書閣官方授權發行，帶給您最純粹的文學感動。
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
