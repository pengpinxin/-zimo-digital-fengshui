import Link from 'next/link';

export default function ServicePage() {
  return (
    <main className="min-h-screen bg-[#1A110B] text-[#E6D5C3] px-6 py-12 flex flex-col items-center">
      {/* 頂部導覽列 / 返回預約按鈕 */}
      <div className="w-full max-w-3xl flex justify-between items-center mb-10 border-b border-[#C59B27]/30 pb-4">
        <Link 
          href="/" 
          className="text-sm tracking-widest text-[#C59B27] hover:text-[#f3d06b] transition-colors flex items-center gap-2"
        >
          ← 返回首頁
        </Link>
        <Link 
          href="/#booking" 
          className="px-4 py-2 bg-[#C59B27] text-[#1A110B] font-medium text-sm rounded tracking-wider hover:bg-[#e2b13c] transition-all shadow-md"
        >
          立即預約諮詢
        </Link>
      </div>

      {/* 核心內容區塊 */}
      <div className="w-full max-w-3xl bg-[#241810] border border-[#C59B27]/40 rounded-lg p-8 md:p-12 shadow-2xl relative overflow-hidden">
        {/* 裝飾性金邊光暈 */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-[#C59B27]/5 rounded-full blur-2xl pointer-events-none"></div>

        {/* 頁面標題 */}
        <div className="text-center mb-8">
          <span className="text-xs uppercase tracking-widest text-[#C59B27] block mb-2">Zi Mo Feng Shui · Professional Service</span>
          <h1 className="text-3xl md:text-4xl font-serif text-[#F5E6CC] tracking-wide mb-4">
            【請填入該頁面專屬主標題】
          </h1>
          <div className="w-16 h-[2px] bg-[#C59B27] mx-auto"></div>
        </div>

        {/* 內文排版 */}
        <div className="space-y-6 text-base md:text-lg leading-relaxed text-[#D4C3B3] font-light mb-10">
          <p>
            這段放置專業、嚴謹的服務介紹或著作核心理念。拒絕流水線式的泛用解答，由紫墨老師親自為您解析深層磁場與人生格局。
          </p>
          <div className="bg-[#1A110B] border-l-2 border-[#C59B27] p-4 text-sm text-[#C59B27]">
            💡 <strong>核心優勢：</strong> 承襲家祖爺爺測字絕學，精準過濾凶煞，為您配置專屬生旺磁場。
          </div>
          <p>
            透過科學與傳統命理的交融，為您的生活與事業尋找安頓身心的完美歸宿。
          </p>
        </div>

        {/* 底部強效轉換按鈕群 */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-6 border-t border-[#C59B27]/20">
          <Link 
            href="/#booking"
            className="w-full sm:w-auto text-center px-8 py-3 bg-[#C59B27] text-[#1A110B] font-medium tracking-wider rounded hover:bg-[#e2b13c] transition-all shadow-lg"
          >
            預約專屬數字解析
          </Link>
          <Link 
            href="/"
            className="w-full sm:w-auto text-center px-8 py-3 border border-[#C59B27]/50 text-[#C59B27] tracking-wider rounded hover:bg-[#C59B27]/10 transition-all"
          >
            返回官方首頁
          </Link>
        </div>
      </div>

      {/* 頁尾版權 */}
      <footer className="mt-16 text-xs text-[#8C7A6B] tracking-widest text-center">
        © 2026 紫墨數字風水 · 彭品心 All Rights Reserved.
      </footer>
    </main>
  );
}
