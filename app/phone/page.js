import Link from 'next/link';

export const metadata = {
  title: '紫墨數字風水｜車牌號碼吉凶與行車平安配置 - 彭品心官網',
  description: '專業數字風水解析，為您的愛車挑選開運吉號，過濾凶煞打造行車平安與招財好磁場。立即聯繫紫墨老師預約諮詢。',
  openGraph: {
    title: '紫墨數字風水｜車牌號碼吉凶與行車平安配置 - 彭品心官網',
    description: '專業數字風水解析，為您的愛車挑選開運吉號，過濾凶煞打造行車平安與招財好磁場。',
    url: 'https://pengpinxin.com/car',
    type: 'website',
  },
};

export default function CarFengShuiPage() {
  return (
    <main className="min-h-screen bg-[#1A110B] text-[#E6D5C3] px-4 py-8 md:py-16 flex flex-col items-center">
      {/* 頂部導覽列 */}
      <div className="w-full max-w-3xl flex justify-between items-center mb-8 border-b border-[#C59B27]/30 pb-4">
        <Link 
          href="/" 
          className="text-sm tracking-wider text-[#C59B27] hover:text-[#f3d06b] transition-colors flex items-center gap-2"
        >
          ← 返回官方首頁
        </Link>
        <Link 
          href="/#booking" 
          className="px-4 py-2 bg-[#C59B27] text-[#1A110B] font-medium text-sm rounded tracking-wider hover:bg-[#e2b13c] transition-all shadow-md"
        >
          立即預約諮詢
        </Link>
      </div>

      {/* 核心內容卡片 */}
      <div className="w-full max-w-3xl bg-[#241810] border border-[#C59B27]/40 rounded-xl p-6 md:p-12 shadow-2xl relative">
        
        {/* 標題與分類 */}
        <div className="text-center mb-8">
          <span className="text-xs uppercase tracking-widest text-[#C59B27] block mb-2">
            Zi Mo Feng Shui · 數字風水車牌號碼專屬解析
          </span>
          <h1 className="text-2xl md:text-4xl font-serif text-[#F5E6CC] tracking-wide mb-4">
            車牌號碼吉凶與行車平安開運配置
          </h1>
          <div className="w-20 h-[2px] bg-[#C59B27] mx-auto"></div>
        </div>

        {/* 內文說明 */}
        <div className="space-y-6 text-base md:text-lg leading-relaxed text-[#D4C3B3] font-light mb-10">
          <p>
            車行天下，平安為本。車牌號碼作為每日伴隨您出門在外的動態磁場，其數字組合直接牽動著行車安全、出行磁場與貴人運勢。
          </p>
          
          <div className="bg-[#1A110B] border-l-4 border-[#C59B27] p-4 text-sm md:text-base text-[#E6D5C3] rounded-r">
            💡 <strong className="text-[#C59B27]">紫墨老師專業解析：</strong> 
            拒絕坊間流水線式的泛用吉凶公式。老師承襲家祖爺爺測字與命理絕學，結合您的本命八字，為您精準過濾凶煞數字，挑選最適合您的開運車牌號碼。
          </div>

          <p>
            為愛車配置一組能化煞生旺的吉祥數字，讓每一次出行都平平安安、事業順遂、財源廣進。
          </p>
        </div>

        {/* ⚡「馬上聯繫老師」專屬互動區塊 */}
        <div className="bg-[#1A110B]/80 border border-[#C59B27]/50 rounded-lg p-6 text-center mb-8">
          <h3 className="text-lg font-serif text-[#F5E6CC] mb-2">想要為您的車牌或號碼進行專業合吉嗎？</h3>
          <p className="text-sm text-[#C59B27] mb-6">紫墨老師親自為您一對一解讀，提供最精準的數字風水配置。</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <a 
              href="mailto:Aaa0987955906aaa@gmail.com"
              className="w-full sm:w-auto px-8 py-3 bg-[#C59B27] text-[#1A110B] font-medium tracking-wider rounded hover:bg-[#e2b13c] transition-all shadow-lg flex items-center justify-center gap-2"
            >
              ✉️ 馬上聯繫老師 (Email)
            </a>
            <a 
              href="https://www.facebook.com/pengpinxin/" 
              target="_blank" 
              rel="noopener noreferrer"
              className="w-full sm:w-auto px-8 py-3 border border-[#C59B27] text-[#C59B27] font-medium tracking-wider rounded hover:bg-[#C59B27]/10 transition-all flex items-center justify-center gap-2"
            >
              💬 前往 Facebook 粉絲專頁聯繫
            </a>
          </div>
        </div>

        {/* 底部按鈕 */}
        <div className="flex justify-center pt-4 border-t border-[#C59B27]/20">
          <Link 
            href="/"
            className="text-sm text-[#C59B27] hover:underline tracking-wider"
          >
            ← 返回官方首頁了解更多服務
          </Link>
        </div>
      </div>

      {/* 頁尾版權 */}
      <footer className="mt-12 text-xs text-[#8C7A6B] tracking-widest text-center">
        © 2026 彭品心 · 品心美學 · 紫墨數字風水 All Rights Reserved.
      </footer>
    </main>
  );
}
