import Link from 'next/link';

export const metadata = {
  title: '品心書閣｜學術文學著作《進階思維的後裔》- 彭品心官網',
  description: '學術文學創作者彭品心深思力作《進階思維的後裔》，突破傳統認知框架，引領讀者開啟深度思考與思維升級。立即聯繫老師了解購書詳情。',
  openGraph: {
    title: '品心書閣｜學術文學著作《進階思維的後裔》- 彭品心官網',
    description: '學術文學創作者彭品心深思力作《進階思維的後裔》，突破傳統認知框架，引領讀者開啟深度思考與思維升級。',
    url: 'https://pengpinxin.com/descendant',
    type: 'website',
  },
};

export default function DescendantBookPage() {
  return (
    <div style={{ backgroundColor: '#1A110B', color: '#E6D5C3', minHeight: '100vh', padding: '24px 16px', display: 'flex', flexDirection: 'column', alignItems: 'center', fontFamily: 'serif' }}>
      
      {/* 頂部導覽列 */}
      <div style={{ width: '100%', maxWidth: '700px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px', borderBottom: '1px solid rgba(197, 155, 39, 0.3)', paddingBottom: '16px' }}>
        <Link href="/" style={{ color: '#C59B27', fontSize: '14px', textDecoration: 'none', letterSpacing: '1px' }}>
          ← 返回官方首頁
        </Link>
        <Link href="/#booking" style={{ backgroundColor: '#C59B27', color: '#1A110B', padding: '8px 16px', borderRadius: '4px', fontSize: '14px', fontWeight: 'bold', textDecoration: 'none', boxShadow: '0 4px 6px rgba(0,0,0,0.3)' }}>
          立即聯繫購書
        </Link>
      </div>

      {/* 核心質感燙金卡片 */}
      <div style={{ width: '100%', maxWidth: '700px', backgroundColor: '#241810', border: '1px solid #C59B27', borderRadius: '12px', padding: '32px 24px', boxShadow: '0 10px 25px rgba(0,0,0,0.5)', boxSizing: 'border-box' }}>
        
        {/* 標題區 */}
        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          <span style={{ fontSize: '11px', textTransform: 'uppercase', letterSpacing: '3px', color: '#C59B27', display: 'block', marginBottom: '8px' }}>
            品心書閣 · 學術文學創作
          </span>
          <h1 style={{ fontSize: '26px', color: '#F5E6CC', letterSpacing: '1px', margin: '0 0 16px 0', lineHeight: '1.4' }}>
            《進階思維的後裔》
          </h1>
          <div style={{ width: '60px', height: '2px', backgroundColor: '#C59B27', margin: '0 auto' }}></div>
        </div>

        {/* 內文說明（《進階思維的後裔》專屬） */}
        <div style={{ fontSize: '16px', lineHeight: '1.8', color: '#D4C3B3', fontWeight: '300', marginBottom: '32px' }}>
          <p style={{ marginBottom: '20px' }}>
            在瞬息萬變的時代浪潮中，我們如何突破既有的認知框架？學術文學創作者彭品心深思力作《進階思維的後裔》，融會哲學思辨與前瞻視野，引領讀者躍升心智層次。
          </p>
          
          <div style={{ backgroundColor: '#1A110B', borderLeft: '4px solid #C59B27', padding: '16px', fontSize: '15px', color: '#E6D5C3', borderRadius: '0 6px 6px 0', marginBottom: '20px' }}>
            💡 <strong style={{ color: '#C59B27' }}>核心思維導讀：</strong> 
            「思維的高度，決定了生命的廣度。本書帶領您打破常規思維的禁錮，掌握進階邏輯與心智演化，在複雜多變的局勢中看清本質、洞察先機。」
          </div>

          <p>
            翻閱此書，與彭品心老師一同展開一場激盪思想、重塑認知與開創未來的思維革新之旅。
          </p>
        </div>

        {/* ⚡「馬上聯繫老師」專屬互動區塊 */}
        <div style={{ backgroundColor: '#1A110B', border: '1px solid rgba(197, 155, 39, 0.5)', borderRadius: '8px', padding: '24px', textAlign: 'center', marginBottom: '24px' }}>
          <h3 style={{ fontSize: '18px', color: '#F5E6CC', margin: '0 0 8px 0' }}>想要收藏《進階思維的後裔》實體著作嗎？</h3>
          <p style={{ fontSize: '13px', color: '#C59B27', margin: '0 0 20px 0' }}>歡迎直接與彭品心老師聯繫洽詢購書與親筆簽名詳情。</p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', justifyContent: 'center' }}>
            <a 
              href="mailto:Aaa0987955906aaa@gmail.com"
              style={{ backgroundColor: '#C59B27', color: '#1A110B', padding: '12px 20px', borderRadius: '6px', fontWeight: 'bold', textDecoration: 'none', fontSize: '15px', display: 'block' }}
            >
              ✉️ 馬上聯繫老師購書 (Email)
            </a>
            <a 
              href="https://www.facebook.com/pengpinxin/" 
              target="_blank" 
              rel="noopener noreferrer"
              style={{ backgroundColor: 'transparent', border: '1px solid #C59B27', color: '#C59B27', padding: '12px 20px', borderRadius: '6px', fontWeight: 'bold', textDecoration: 'none', fontSize: '15px', display: 'block' }}
            >
              💬 前往 Facebook 粉絲專頁聯繫
            </a>
          </div>
        </div>

        {/* 底部按鈕 */}
        <div style={{ textAlign: 'center', paddingTop: '16px', borderTop: '1px solid rgba(197, 155, 39, 0.2)' }}>
          <Link href="/" style={{ color: '#C59B27', fontSize: '13px', textDecoration: 'none', letterSpacing: '1px' }}>
            ← 返回官方首頁探索更多著作
          </Link>
        </div>
      </div>

      {/* 頁尾版權 */}
      <footer style={{ marginTop: '32px', fontSize: '11px', color: '#8C7A6B', letterSpacing: '2px', textAlign: 'center' }}>
        © 2026 彭品心 · 品心書閣 · 紫墨數字風水 All Rights Reserved.
      </footer>
    </div>
  );
}
