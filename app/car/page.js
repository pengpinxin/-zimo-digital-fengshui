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
    <div style={{ backgroundColor: '#1A110B', color: '#E6D5C3', minHeight: '100vh', padding: '24px 16px', display: 'flex', flexDirection: 'column', alignItems: 'center', fontFamily: 'serif' }}>
      
      {/* 頂部導覽列 */}
      <div style={{ width: '100%', maxWidth: '700px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px', borderBottom: '1px solid rgba(197, 155, 39, 0.3)', paddingBottom: '16px' }}>
        <Link href="/" style={{ color: '#C59B27', fontSize: '14px', textDecoration: 'none', letterSpacing: '1px' }}>
          ← 返回官方首頁
        </Link>
        <Link href="/#booking" style={{ backgroundColor: '#C59B27', color: '#1A110B', padding: '8px 16px', borderRadius: '4px', fontSize: '14px', fontWeight: 'bold', textDecoration: 'none', boxShadow: '0 4px 6px rgba(0,0,0,0.3)' }}>
          立即預約諮詢
        </Link>
      </div>

      {/* 核心質感燙金卡片 */}
      <div style={{ width: '100%', maxWidth: '700px', backgroundColor: '#241810', border: '1px solid #C59B27', borderRadius: '12px', padding: '32px 24px', boxShadow: '0 10px 25px rgba(0,0,0,0.5)', boxSizing: 'border-box' }}>
        
        {/* 標題區（已移除多餘英文字） */}
        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          <h1 style={{ fontSize: '26px', color: '#F5E6CC', letterSpacing: '1px', margin: '0 0 16px 0', lineHeight: '1.4' }}>
            車牌號碼吉凶與行車平安開運配置
          </h1>
          <div style={{ width: '60px', height: '2px', backgroundColor: '#C59B27', margin: '0 auto' }}></div>
        </div>

        {/* 內文說明 */}
        <div style={{ fontSize: '16px', lineHeight: '1.8', color: '#D4C3B3', fontWeight: '300', marginBottom: '32px' }}>
          <p style={{ marginBottom: '20px' }}>
            車行天下，平安為本。車牌號碼作為每日伴隨您出門在外的動態磁場，其數字組合直接牽動著行車安全、出行磁場與貴人運勢。
          </p>
          
          <div style={{ backgroundColor: '#1A110B', borderLeft: '4px solid #C59B27', padding: '16px', fontSize: '15px', color: '#E6D5C3', borderRadius: '0 6px 6px 0', marginBottom: '20px' }}>
            💡 <strong style={{ color: '#C59B27' }}>紫墨老師專業解析：</strong> 
            拒絕坊間流水線式的泛用吉凶公式。老師承襲家祖爺爺測字與命理絕學，結合您的本命八字，為您精準過濾凶煞數字，挑選最適合您的開運車牌號碼。
          </div>

          <p>
            為愛車配置一組能化煞生旺的吉祥數字，讓每一次出行都平平安安、事業順遂、財源廣進。
          </p>
        </div>

        {/* ⚡「馬上聯繫老師」專屬互動區塊 */}
        <div style={{ backgroundColor: '#1A110B', border: '1px solid rgba(197, 155, 39, 0.5)', borderRadius: '8px', padding: '24px', textAlign: 'center', marginBottom: '24px' }}>
          <h3 style={{ fontSize: '18px', color: '#F5E6CC', margin: '0 0 8px 0' }}>想要為您的車牌或號碼進行專業合吉嗎？</h3>
          <p style={{ fontSize: '13px', color: '#C59B27', margin: '0 0 20px 0' }}>紫墨老師親自為您一對一解讀，提供最精準的數字風水配置。</p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', justifyContent: 'center' }}>
            <a 
              href="mailto:Aaa0987955906aaa@gmail.com"
              style={{ backgroundColor: '#C59B27', color: '#1A110B', padding: '12px 20px', borderRadius: '6px', fontWeight: 'bold', textDecoration: 'none', fontSize: '15px', display: 'block' }}
            >
              ✉️ 馬上聯繫老師 (Email)
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
            ← 返回官方首頁了解更多服務
          </Link>
        </div>
      </div>

      {/* 頁尾版權 */}
      <footer style={{ marginTop: '32px', fontSize: '11px', color: '#8C7A6B', letterSpacing: '2px', textAlign: 'center' }}>
        © 2026 彭品心 · 品心美學 · 紫墨數字風水 All Rights Reserved.
      </footer>
    </div>
  );
}
