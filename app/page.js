'use client';
import { useState, useEffect } from 'react';

const META_PIXEL_ID = '2001571467480785';

export default function Home(){
  const [cart, setCart] = useState([]);
  const [isVip, setIsVip] = useState(false);
  const [artworks, setArtworks] = useState([]);
  const [vipCode, setVipCode] = useState('');
  const [cName, setCName] = useState('');
  const [cPhone, setCPhone] = useState('');
  const [cEmail, setCEmail] = useState('');
  const [cAddress, setCAddress] = useState('');
  const [cRemark, setCRemark] = useState('');
  const [isCheckingOut, setIsCheckingOut] = useState(false);
  const [activeImage, setActiveImage] = useState(null);
  const [highlightedArt, setHighlightedArt] = useState(null);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    if (!window.fbq) {
      const fbq = function () {
        if (fbq.callMethod) {
          fbq.callMethod.apply(fbq, arguments);
        } else {
          fbq.queue.push(arguments);
        }
      };
      if (!window._fbq) window._fbq = fbq;
      fbq.push = fbq;
      fbq.loaded = true;
      fbq.version = '2.0';
      fbq.queue = [];
      window.fbq = fbq;

      const script = document.createElement('script');
      script.async = true;
      script.src = 'https://connect.facebook.net/en_US/fbevents.js';
      document.head.appendChild(script);

      window.fbq('init', META_PIXEL_ID);
      window.fbq('track', 'PageView');
    }
  }, []);

  const trackMetaEvent = (eventName, params = {}) => {
    if (typeof window !== 'undefined' && typeof window.fbq === 'function') {
      window.fbq('track', eventName, params);
    }
  };

  useEffect(() => {
    const c = localStorage.getItem('z_cart');
    if(c){ try{ setCart(JSON.parse(c)); }catch(e){ setCart([]); } }

    fetch('/api/artworks')
      .then(res => res.json())
      .then(data => {
        if (data.success && data.artworks && data.artworks.length > 0) {
          setArtworks(data.artworks);
        } else {
          const a = localStorage.getItem('z_art');
          if(a){ try{ setArtworks(JSON.parse(a)); }catch(e){ setArtworks([]); } }
        }
      })
      .catch(() => {
        const a = localStorage.getItem('z_art');
        if(a){ try{ setArtworks(JSON.parse(a)); }catch(e){ setArtworks([]); } }
      });
  }, []);

  useEffect(() => {
    if (artworks.length === 0) return;
    const params = new URLSearchParams(window.location.search);
    const targetArt = params.get('art');
    if (targetArt) {
      const targetIdx = artworks.findIndex(item => item.name === targetArt);
      if (targetIdx !== -1) {
        setHighlightedArt(targetArt);
        setTimeout(() => {
          document.getElementById('art-card-' + targetIdx)?.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }, 300);
      }
    }
  }, [artworks]);

  useEffect(() => {
    localStorage.setItem('z_cart', JSON.stringify(cart));
  }, [cart]);

  const addToCart = (name, price, contentId = '') => {
    setCart(prev => [...prev, { name, price }]);

    const eventPayload = {
      content_name: name,
      content_type: 'product',
      value: price,
      currency: 'TWD',
    };
    if (contentId) {
      eventPayload.content_ids = [contentId];
    }
    trackMetaEvent('AddToCart', eventPayload);

    document.getElementById('cart')?.classList.add('open');
  };

  const removeFromCart = (index) => {
    setCart(prev => prev.filter((_, idx) => idx !== index));
  };

  const handleVerifyVipCode = () => {
    if(vipCode.trim() === 'VIP880'){
      setIsVip(true);
      alert('VIP 優惠碼驗證成功！');
    } else {
      alert('優惠代碼錯誤');
    }
  };

  const checkPhoneVip = (phone) => {
    const cleanPhone = phone.trim();
    if(!cleanPhone) return;
    const vipPhones = JSON.parse(localStorage.getItem('z_vip_phones') || '[]');
    if(vipPhones.includes(cleanPhone)){
      setIsVip(true);
      alert('👑 系統自動辨識：此電話已綁定 VIP 880 終身會員，已直接享有全館 9 折優惠！');
    }
  };

  const handleCheckout = async () => {
    if(!cName || !cPhone || !cEmail || !cAddress){ 
      alert('請完整填寫收件與聯絡資訊'); 
      return; 
    }
    if(cart.length === 0){ 
      alert('購物車是空的'); 
      return; 
    }

    trackMetaEvent('InitiateCheckout', {
      content_name: cart.map(i => i.name).join(', '),
      content_type: 'product',
      num_items: cart.length,
      value: total,
      currency: 'TWD',
    });

    setIsCheckingOut(true);
    try {
      const orderData = {
        itemName: cart.map(i => i.name).join(', '),
        totalAmount: total,
        customerName: cName,
        customerPhone: cPhone,
        customerEmail: cEmail,
        shippingAddress: cAddress,
        remark: cRemark,
        items: cart,
        total: total,
        isVip: isVip
      };

      const res = await fetch('/api/ecpay', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(orderData),
      });

      const result = await res.json();
      if (result.success) {
        const hasVipItem = cart.some(item => item.name.includes('VIP 880'));
        if(hasVipItem || isVip){
          const vipPhones = JSON.parse(localStorage.getItem('z_vip_phones') || '[]');
          if(!vipPhones.includes(cPhone)){
            vipPhones.push(cPhone);
            localStorage.setItem('z_vip_phones', JSON.stringify(vipPhones));
          }
        }

        if (result.gatewayUrl && result.params) {
          const form = document.createElement('form');
          form.method = 'POST';
          form.action = result.gatewayUrl;

          for (const key in result.params) {
            const input = document.createElement('input');
            input.type = 'hidden';
            input.name = key;
            input.value = result.params[key];
            form.appendChild(input);
          }

          document.body.appendChild(form);
          form.submit();
          return;
        }

        if (result.htmlForm) {
          document.open();
          document.write(result.htmlForm);
          document.close();
          return;
        }

        alert('感謝 ' + cName + ' 緣主！訂單已成功送出。');
        setCart([]);
        setIsVip(false);
        setCName(''); setCPhone(''); setCEmail(''); setCAddress(''); setCRemark('');
        closeCart();
      } else {
        alert('結帳送出發生異常：' + (result.error || result.message || '請確認後端設定'));
      }
    } catch (error) {
      console.error('結帳連線錯誤:', error);
      alert('連線伺服器發生錯誤，請稍後再試');
    } finally {
      setIsCheckingOut(false);
    }
  };

  const openCart = () => document.getElementById('cart')?.classList.add('open');
  const closeCart = () => document.getElementById('cart')?.classList.remove('open');
  const openMenu = () => document.getElementById('menu')?.classList.add('open');
  const closeMenu = () => document.getElementById('menu')?.classList.remove('open');

  let total = cart.reduce((s, i) => s + i.price, 0);
  if(isVip) total = Math.round(total * 0.9);
  const vipText = isVip ? ' (已享 VIP 9折)' : '';

  return (
    <div style={{minHeight:'100vh', background:'#1a1714', color:'#f3efe6'}} onContextMenu={(e) => e.preventDefault()}>
      <style jsx global>{`
        :root{--bg:#1a1714;--card:#24201c;--border:#4a3d31;--text:#f3efe6;--gold:#d4af37;--gold-l:#f3e5ab;color-scheme:dark;}
        html,body{background:#1a1714 !important;color:#f3efe6 !important;-webkit-text-size-adjust:100%;text-size-adjust:100%;forced-color-adjust:none;}
        *{box-sizing:border-box;margin:0;padding:0;font-family:-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,"Noto Sans TC",sans-serif;}
        body{line-height:1.6;padding-bottom:60px;-webkit-touch-callout:none;overflow-x:hidden;}
        img{-webkit-user-drag:none;user-select:none;pointer-events:auto;}
        button{-webkit-appearance:none;appearance:none;font-family:inherit;forced-color-adjust:none;}
        header{background:#1a1714 !important;border-bottom:1px solid var(--border);padding:10px 14px;position:sticky;top:0;z-index:500;display:flex;justify-content:space-between;align-items:center;gap:8px;-webkit-transform:translateZ(0);transform:translateZ(0);}
        .btn{background:linear-gradient(135deg,#d4af37,#b59226) !important;color:#1a1714 !important;border:1px solid #e2c15a;padding:7px 12px;border-radius:14px;font-size:0.75rem;font-weight:700;cursor:pointer;display:inline-flex;align-items:center;justify-content:center;white-space:nowrap;line-height:1.2;}
        .btn-o{background:#24201c !important;border:1px solid var(--gold) !important;color:#f3e5ab !important;}
        /* 🎨 畫作購買按鈕：黑底金框、4K 與 8K 顏色完全統一 */
        .art-btn-group{display:flex;flex-direction:column;gap:6px;margin-top:8px;}
        .btn-art-buy{width:100%;height:34px;padding:0 8px;border-radius:14px;background:#1a1714 !important;color:#f3e5ab !important;border:1px solid #d4af37 !important;font-size:0.75rem;font-weight:700;letter-spacing:0.4px;display:flex;align-items:center;justify-content:center;white-space:nowrap;line-height:1;cursor:pointer;}
        .btn-art-buy:active{background:#2f281f !important;}
        .btn-art-link{width:100%;height:30px;padding:0 8px;border-radius:14px;background:transparent !important;color:#d0c5b4 !important;border:1px solid rgba(212,175,55,0.4) !important;font-size:0.7rem;font-weight:500;display:flex;align-items:center;justify-content:center;white-space:nowrap;line-height:1;cursor:pointer;}
        .wrap{max-width:750px;margin:0 auto;padding:15px;}
        .card{background:var(--card);border:1px solid var(--border);border-radius:8px;padding:15px;margin-bottom:15px;display:flex;gap:15px;align-items:center;}
        .card img{width:140px;aspect-ratio:16/9;object-fit:cover;border-radius:6px;border:1px solid var(--border);}
        .grid{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:10px;margin-bottom:20px;}
        .s-card{background:var(--card);border:1px solid var(--border);border-radius:8px;padding:12px;display:flex;flex-direction:column;justify-content:space-between;min-width:0;overflow:hidden;}
        .drawer{position:fixed;top:0;right:-100%;width:100%;max-width:320px;height:100%;background:var(--card);border-left:1px solid var(--border);z-index:1000;padding:15px;transition:0.3s;display:flex;flex-direction:column;overflow-y:auto;}
        .drawer.open{right:0;}
        input,textarea{width:100%;padding:10px;margin-bottom:8px;background:#1a1714 !important;border:1px solid var(--border);color:#f3efe6 !important;border-radius:6px;font-size:0.9rem;-webkit-appearance:none;appearance:none;}
        .notice-box{background:rgba(212,175,55,0.05);border:1px solid var(--border);border-radius:8px;padding:15px;margin:15px 0;font-size:0.8rem;color:#d0c5b4;}
        .notice-box h4{color:var(--gold-l);margin-bottom:8px;font-size:0.9rem;}
        .notice-box ul{padding-left:18px;}
        .notice-box li{margin-bottom:6px;}
        .lightbox-overlay { position: fixed; top: 0; left: 0; width: 100vw; height: 100vh; background: rgba(0,0,0,0.85); z-index: 2000; display: flex; align-items: center; justify-content: center; padding: 20px; backdrop-filter: blur(4px); }
        .lightbox-content { position: relative; max-width: 90%; max-height: 90%; text-align: center; }
        .lightbox-content img { width: 100%; height: auto; max-height: 80vh; object-fit: contain; border-radius: 8px; border: 1px solid var(--gold); box-shadow: 0 10px 30px rgba(0,0,0,0.5); }
        .lightbox-close { position: absolute; top: -45px; right: 0; background: var(--card); border: 1px solid var(--gold); color: var(--gold-l); padding: 6px 14px; border-radius: 20px; font-size: 0.85rem; font-weight: bold; cursor: pointer; }
      `}</style>

      <header>
        <div style={{display:'flex',alignItems:'center',gap:'8px',minWidth:0}}>
          <div style={{width:'34px',height:'34px',flexShrink:0,border:'1px solid var(--gold)',borderRadius:'50%',display:'flex',alignItems:'center',justifyContent:'center',color:'var(--gold)',fontWeight:'bold'}}>品</div>
          <div style={{minWidth:0}}>
            <h1 style={{fontSize:'0.9rem',color:'var(--gold-l)',whiteSpace:'nowrap'}}>品心美學</h1>
            <p style={{fontSize:'0.65rem',color:'#d0c5b4',whiteSpace:'nowrap'}}>彭品心老師官方網站</p>
          </div>
        </div>
        <div style={{display:'flex',gap:'6px',flexShrink:0}}>
          <button className="btn btn-o" onClick={openCart}>🛒 購物車({cart.length})</button>
          <button className="btn btn-o" onClick={openMenu}>☰ 選單</button>
        </div>
      </header>

      <div className="drawer" id="menu">
        <div style={{display:'flex',justifyContent:'space-between',marginBottom:'15px'}}>
          <h3 style={{color:'var(--gold-l)'}}>導覽</h3>
          <button onClick={closeMenu} style={{background:'none',border:'none',color:'#fff',fontSize:'1.2rem'}}>✕</button>
        </div>
        <div style={{display:'flex',flexDirection:'column',gap:'12px'}}>
          <a href="#vip" onClick={closeMenu} style={{color:'var(--gold-l)',textDecoration:'none'}}>💎 VIP 880 會員專屬福利</a>
          <a href="#intro" onClick={closeMenu} style={{color:'var(--gold-l)',textDecoration:'none'}}>📖 靈魂的棲息之處</a>
          <a href="#books" onClick={closeMenu} style={{color:'var(--gold-l)',textDecoration:'none'}}>📚 學術文學著作</a>
          <a href="#services" onClick={closeMenu} style={{color:'var(--gold-l)',textDecoration:'none'}}>🔮 紫墨數字風水</a>
          <a href="#art" onClick={closeMenu} style={{color:'var(--gold-l)',textDecoration:'none'}}>🎨 原創開運藝術畫</a>
          <a href="#contact" onClick={closeMenu} style={{color:'var(--gold-l)',textDecoration:'none'}}>📞 聯絡方式</a>
          <a href="#legal" onClick={closeMenu} style={{color:'var(--gold-l)',textDecoration:'none'}}>⚖️ 法律責任與聲明</a>
        </div>
      </div>

      <div className="wrap">
        <div style={{width:'100%',borderRadius:'8px',overflow:'hidden',border:'1px solid var(--border)',marginBottom:'15px'}}>
          <img src="/1792354723564.png" style={{width:'100%',display:'block'}} alt="b" onContextMenu={(e)=>e.preventDefault()} onDragStart={(e)=>e.preventDefault()} />
        </div>
        
        <div id="vip" style={{background:'rgba(212,175,55,0.08)',border:'1px solid var(--gold)',borderRadius:'8px',padding:'15px',textAlign:'center',marginBottom:'20px'}}>
          <h3 style={{color:'var(--gold-l)',marginBottom:'5px'}}>✨ VIP 880 會員專屬福利</h3>
          <p style={{fontSize:'0.8rem',color:'#d0c5b4',marginBottom:'10px'}}>享有全館著作、數字配置與原創畫作<strong>終身九折</strong>禮遇！</p>
          <button className="btn" onClick={()=>addToCart('VIP 880 終身會員方案', 880, 'VIP880')}>加入 VIP 880 方案 (NT$ 880)</button>
        </div>

        <section id="intro" className="notice-box" style={{padding:'20px'}}>
          <h2 style={{color:'var(--gold-l)',fontSize:'1.2rem',marginBottom:'12px',textAlign:'center'}}>靈魂的棲息之處</h2>
          <p style={{fontSize:'0.85rem',color:'#f3efe6',marginBottom:'12px',lineHeight:'1.8',textAlign:'center'}}>
            喧囂的世間，每個人都在找尋安放靈魂的角落，這裡是開運、療愈、藝術與和諧於一體的心靈家園，品心&紫墨老師歡迎您的到來！
          </p>
          <p style={{fontSize:'0.8rem',color:'#d0c5b4',lineHeight:'1.8'}}>
            老師十歲繼承家祖爺爺精準測字絕學，傾於一生對數字、文學、玄學、及各學術類的興趣，藏拙於一身靈性與道行，歷經幾十載世俗的考驗，她清雅脫俗地出落在紅塵萬里天地之間，悉心等待著為值得的人送去福音，將她畢生的學術研究成果，盡心耕織於人類與環境實際需求，廣結善緣、讓福音傳遍千里之外，讓靈慧助人於無形之中。
          </p>
        </section>

        <section id="books">
          <h3 style={{color:'var(--gold-l)',borderLeft:'3px solid var(--gold)',paddingLeft:'8px',margin:'20px 0 6px 0'}}>學術文學著作</h3>
          <p style={{fontSize:'0.75rem',color:'#d0c5b4',marginBottom:'12px',paddingLeft:'4px'}}>彭品心老師深具靈性與學術深度的經典力作，引領讀者開啟高維度思維與生命轉折。</p>
          
          <div className="card">
            <img src="/1792440195898.jpg" alt="b1" onClick={()=>setActiveImage('/1792440195898.jpg')} style={{cursor:'pointer'}} onContextMenu={(e)=>e.preventDefault()} onDragStart={(e)=>e.preventDefault()} />
            <div style={{flex:1}}>
              <h4>生命的出口</h4>
              <div style={{color:'var(--gold)',fontWeight:'bold'}}>NT$ 269</div>
              <p style={{fontSize:'0.8rem',color:'#d0c5b4'}}>心靈轉折與生命出口經典力作。</p>
              <div style={{display:'flex',gap:'6px',marginTop:'8px',flexWrap:'wrap'}}>
                <button className="btn btn-o" onClick={()=>addToCart('生命的出口', 269, 'book-exit')}>加入購物車</button>
                <button className="btn btn-o" style={{fontSize:'0.7rem',padding:'6px 8px'}} onClick={()=>{
                  const url = window.location.origin + '/exit';
                  navigator.clipboard.writeText(url);
                  alert('已複製《生命的出口》專屬分頁連結！');
                }}>🔗 複製專屬連結</button>
              </div>
            </div>
          </div>

          <div className="card">
            <img src="/1792450518058.jpg" alt="b2" onClick={()=>setActiveImage('/1792450518058.jpg')} style={{cursor:'pointer'}} onContextMenu={(e)=>e.preventDefault()} onDragStart={(e)=>e.preventDefault()} />
            <div style={{flex:1}}>
              <h4>進階思維的後裔</h4>
              <div style={{color:'var(--gold)',fontWeight:'bold'}}>NT$ 269</div>
              <p style={{fontSize:'0.8rem',color:'#d0c5b4'}}>開啟高維度思維模式與人生格局。</p>
              <div style={{display:'flex',gap:'6px',marginTop:'8px',flexWrap:'wrap'}}>
                <button className="btn btn-o" onClick={()=>addToCart('進階思維的後裔', 269, 'book-descendant')}>加入購物車</button>
                <button className="btn btn-o" style={{fontSize:'0.7rem',padding:'6px 8px'}} onClick={()=>{
                  const url = window.location.origin + '/descendant';
                  navigator.clipboard.writeText(url);
                  alert('已複製《進階思維的後裔》專屬分頁連結！');
                }}>🔗 複製專屬連結</button>
              </div>
            </div>
          </div>
        </section>

        <section id="services">
          <h3 style={{color:'var(--gold-l)',borderLeft:'3px solid var(--gold)',paddingLeft:'8px',margin:'20px 0 8px 0'}}>紫墨數字風水</h3>
          <div className="notice-box" style={{marginTop:'0', marginBottom:'10px', padding:'10px 14px', textAlign:'center', borderColor:'rgba(212,175,55,0.45)'}}>
            <p style={{fontSize:'0.88rem', color:'var(--gold-l)', fontWeight:'bold', letterSpacing:'1px', margin:0}}>改變自己，先要改變磁場。</p>
          </div>
          <p style={{fontSize:'0.75rem',color:'#d0c5b4',marginBottom:'10px',paddingLeft:'4px'}}>專業數字風水配置、手機車牌住址選吉與八字命理諮詢服務。</p>
          <div className="notice-box" style={{marginTop:'0', marginBottom:'12px'}}>
            <h4 style={{color:'var(--gold-l)',marginBottom:'6px'}}>📌 購買服務注意事項與流程說明</h4>
            <ul style={{paddingLeft:'16px',fontSize:'0.75rem',lineHeight:'1.6'}}>
              <li><strong>1. 預約流程：</strong>手機、車牌、店鋪、住址配置高端生旺風水號碼，須請您先自行向相關單位申請或初步選定您喜歡的 3～5 組號碼，再透過預約表單告訴紫墨老師，老師將為您進行人工深度解析與最終吉凶配置！</li>
              <li><strong>2. 專業鑑定聲明：</strong>經過老師數字分析之後，如若您的原生號碼本身就是生旺您的吉數，那麼便是最好的數字配置，則不需要更換；然而，老師則同樣會收取您的鑑定費用。因為這是消耗老師大量精力的專業性諮詢服務，還請緣主務必尊重學術文學的強大驅動力。</li>
              <li><strong>3. 服務性質：</strong>數位與命理客製化配置服務確認開始執行後，恕不接受無理由退款。</li>
              <li><strong>4. 理性參考：</strong>所有風水磁場與號碼配置旨在輔助提升運勢與心境，個人努力與正念亦為成就之本。</li>
              <li><strong>5. 備註填寫：</strong>購買服務請在備註欄位填寫您的出生年月日時，及現有號碼跟您欲要更換的號碼，謝謝您！</li>
            </ul>
          </div>
          
          <div className="grid">
            <div className="s-card">
              <div>
                <h4 style={{display:'flex',alignItems:'center',gap:'6px'}}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--gold)" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" style={{flexShrink:0}}><rect x="5" y="2" width="14" height="20" rx="2" ry="2"/><line x1="12" y1="18" x2="12.01" y2="18"/></svg>
                  <span>手機號碼配置</span>
                </h4>
                <div style={{color:'var(--gold)',fontWeight:'bold'}}>NT$ 1,680</div>
                <p style={{fontSize:'0.75rem',color:'#d0c5b4'}}>選定生旺手機吉號。</p>
              </div>
              <div style={{marginTop:'10px',display:'flex',flexDirection:'column',gap:'6px'}}>
                <button className="btn btn-o" style={{width:'100%'}} onClick={()=>addToCart('手機號碼配置', 1680, 'service-phone')}>加入購物車</button>
                <button className="btn btn-o" style={{width:'100%',fontSize:'0.7rem',padding:'6px'}} onClick={()=>{
                  const url = window.location.origin + '/phone';
                  navigator.clipboard.writeText(url);
                  alert('已複製「手機號碼配置」專屬分頁連結！');
                }}>🔗 複製專屬連結</button>
              </div>
            </div>

            <div className="s-card">
              <div>
                <h4 style={{display:'flex',alignItems:'center',gap:'6px'}}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--gold)" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" style={{flexShrink:0}}><path d="M19 17h2c.6 0 1-.4 1-1v-3c0-.9-.7-1.7-1.5-1.9C18.7 10.6 16 10 16 10s-1.3-1.4-2.2-2.3c-.5-.4-1.1-.7-1.8-.7H5c-.6 0-1.1.4-1.4.9l-1.4 2.9A3.7 3.7 0 0 0 2 12v4c0 .6.4 1 1 1h2"/><circle cx="7" cy="17" r="2"/><path d="M9 17h6"/><circle cx="17" cy="17" r="2"/></svg>
                  <span>車牌號碼配置</span>
                </h4>
                <div style={{color:'var(--gold)',fontWeight:'bold'}}>NT$ 1,880</div>
                <p style={{fontSize:'0.75rem',color:'#d0c5b4'}}>行車平安磁場加持。</p>
              </div>
              <div style={{marginTop:'10px',display:'flex',flexDirection:'column',gap:'6px'}}>
                <button className="btn btn-o" style={{width:'100%'}} onClick={()=>addToCart('車牌號碼配置', 1880, 'service-car')}>加入購物車</button>
                <button className="btn btn-o" style={{width:'100%',fontSize:'0.7rem',padding:'6px'}} onClick={()=>{
                  const url = window.location.origin + '/car';
                  navigator.clipboard.writeText(url);
                  alert('已複製「車牌號碼配置」專屬分頁連結！');
                }}>🔗 複製專屬連結</button>
              </div>
            </div>

            <div className="s-card">
              <div>
                <h4 style={{display:'flex',alignItems:'center',gap:'6px'}}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--gold)" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" style={{flexShrink:0}}><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>
                  <span>住址門牌選吉</span>
                </h4>
                <div style={{color:'var(--gold)',fontWeight:'bold'}}>NT$ 3,680</div>
                <p style={{fontSize:'0.75rem',color:'#d0c5b4'}}>住宅環境風水選吉。</p>
              </div>
              <div style={{marginTop:'10px',display:'flex',flexDirection:'column',gap:'6px'}}>
                <button className="btn btn-o" style={{width:'100%'}} onClick={()=>addToCart('住址門牌選吉', 3680, 'service-address')}>加入購物車</button>
                <button className="btn btn-o" style={{width:'100%',fontSize:'0.7rem',padding:'6px'}} onClick={()=>{
                  const url = window.location.origin + '/address';
                  navigator.clipboard.writeText(url);
                  alert('已複製「住址門牌選吉」專屬分頁連結！');
                }}>🔗 複製專屬連結</button>
              </div>
            </div>

            <div className="s-card">
              <div>
                <h4 style={{display:'flex',alignItems:'center',gap:'6px'}}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--gold)" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" style={{flexShrink:0}}><path d="M3 9l1-5h16l1 5"/><path d="M3 9a3 3 0 0 0 6 0 3 3 0 0 0 6 0 3 3 0 0 0 6 0"/><path d="M5 12v8a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1v-8"/></svg>
                  <span>店鋪門牌選吉</span>
                </h4>
                <div style={{color:'var(--gold)',fontWeight:'bold'}}>NT$ 5,680</div>
                <p style={{fontSize:'0.75rem',color:'#d0c5b4'}}>商舖聚財客源廣進。</p>
              </div>
              <div style={{marginTop:'10px',display:'flex',flexDirection:'column',gap:'6px'}}>
                <button className="btn btn-o" style={{width:'100%'}} onClick={()=>addToCart('店鋪門牌選吉', 5680, 'service-store')}>加入購物車</button>
                <button className="btn btn-o" style={{width:'100%',fontSize:'0.7rem',padding:'6px'}} onClick={()=>{
                  const url = window.location.origin + '/store';
                  navigator.clipboard.writeText(url);
                  alert('已複製「店鋪門牌選吉」專屬分頁連結！');
                }}>🔗 複製專屬連結</button>
              </div>
            </div>
          </div>
        </section>

        {/* 📞 聯絡方式區塊（完整保留原有聯絡方式並新增電話：02-28323010） */}
        <section id="contact">
          <h3 style={{color:'var(--gold-l)',borderLeft:'3px solid var(--gold)',paddingLeft:'8px',margin:'20px 0 8px 0'}}>生命值得更好地待遇</h3>
          <p style={{fontSize:'0.75rem',color:'#d0c5b4',marginBottom:'10px',paddingLeft:'4px'}}>官方私域引流與專屬預約管道</p>
          <div className="notice-box" style={{marginTop:'0', marginBottom:'12px'}}>
            <h4 style={{color:'var(--gold-l)',marginBottom:'6px'}}>📞 聯絡方式與預約專線</h4>
            <p style={{fontSize:'0.8rem',margin:'6px 0'}}><strong>服務老師：</strong>彭品心 (紫墨老師)</p>
            <p style={{fontSize:'0.8rem',margin:'6px 0'}}><strong>電話：</strong><a href="tel:0228323010" style={{color:'var(--gold-l)',textDecoration:'none'}}>02-28323010</a></p>
            <p style={{fontSize:'0.8rem',margin:'6px 0'}}><strong>預約電話：</strong><a href="tel:0987955906" style={{color:'var(--gold-l)',textDecoration:'none'}}>0987-955-906</a></p>
            <p style={{fontSize:'0.8rem',margin:'6px 0'}}><strong>官方 LINE ID：</strong>0987955906</p>
            <p style={{fontSize:'0.8rem',margin:'6px 0'}}><strong>電子信箱：</strong>aaa0987955906aaa@gmail.com</p>
            <p style={{fontSize:'0.8rem',margin:'6px 0'}}><strong>官方臉書粉專：</strong><a href="https://www.facebook.com/pengpinxin/" target="_blank" rel="noopener noreferrer" style={{color:'var(--gold-l)',textDecoration:'underline'}}>https://www.facebook.com/pengpinxin/</a></p>
            <p style={{fontSize:'0.8rem',margin:'8px 0 0 0',borderTop:'1px dashed var(--border)',paddingTop:'8px'}}><strong>工作時間：</strong>早上 10 點至晚上 10 點</p>
          </div>
        </section>

        {/* 🎨 原創開運數位藝術畫專區 */}
        <section id="art">
          <h3 style={{color:'var(--gold-l)',borderLeft:'3px solid var(--gold)',paddingLeft:'8px',margin:'20px 0 8px 0'}}>原創開運數位藝術畫</h3>
          <div className="notice-box" style={{marginTop:'0', marginBottom:'10px', padding:'10px 14px', textAlign:'center', borderColor:'rgba(212,175,55,0.45)'}}>
            <p style={{fontSize:'0.88rem', color:'var(--gold-l)', fontWeight:'bold', letterSpacing:'1px', margin:0}}>好畫跟好人，好畫旺福主！</p>
          </div>
          <p style={{fontSize:'0.75rem',color:'#d0c5b4',marginBottom:'12px',paddingLeft:'4px'}}>品心美學精選高解析度東方水墨與五行開運藝術掛畫（已自動從雲端同步全部畫作）。</p>
          
          <div className="notice-box" style={{marginTop:'0', marginBottom:'15px'}}>
            <h4 style={{color:'var(--gold-l)',marginBottom:'8px'}}>🎨 數位藝術畫空間配置與版權說明</h4>
            <p style={{fontSize:'0.8rem',lineHeight:'1.7',color:'#f3efe6',marginBottom:'10px'}}>
              品心美學開運數位五行畫作，不僅適用於<strong>客廳、玄關、房間、餐廳、書房</strong>等居家空間，更是<strong>送人首選、豪宅首選</strong>，亦是傳遞心意與情感交流的雅緻之禮。高解析原圖檔購買後可永久保存，享有自由選框搭配的空間優勢，並可透過線上網路輕鬆印製畫作，依空間自由挑選做框規格與大小比例。
            </p>
            <p style={{fontSize:'0.8rem',lineHeight:'1.7',color:'#f3efe6',marginBottom:'12px'}}>
              全系列提供 <strong>4K（5,000 像素以上）</strong> 與 <strong>8K（10,000 像素以上）</strong> 稀缺高解析原檔（直式／橫式），遠超一般網路縮圖；除了居家珍藏與禮贈，亦具有廣泛商用價值，適用於<strong>總裁與領導辦公室、茶舍、餐廳，以及各行各業開業典禮增彩</strong>，為空間注入溫潤氣場與生生不息的格局。
            </p>

            <div style={{borderTop:'1px dashed var(--border)',paddingTop:'10px',marginBottom:'10px'}}>
              <p style={{fontSize:'0.82rem',fontWeight:'bold',color:'var(--gold-l)',marginBottom:'4px'}}>📩 數位藝術典藏與寄送</p>
              <p style={{fontSize:'0.78rem',lineHeight:'1.6',color:'#d0c5b4'}}>
                付款確認後，專人將透過電子郵件直接寄送未壓縮超高畫質原圖大檔，請確保填寫正確的 Email 地址以利接收。
              </p>
            </div>

            <div style={{borderTop:'1px dashed var(--border)',paddingTop:'10px',marginBottom:'10px'}}>
              <p style={{fontSize:'0.82rem',fontWeight:'bold',color:'var(--gold-l)',marginBottom:'6px'}}>🖥️ 稀缺超高像素・科學無損輸出規格指南</p>
              <ul style={{paddingLeft:'16px',fontSize:'0.78rem',lineHeight:'1.65',color:'#d0c5b4'}}>
                <li>
                  <strong style={{color:'var(--gold-l)'}}>4K 高清珍藏版（5,000 像素以上）｜NT$ 1,280：</strong>
                  依藝術微噴科學標準實算，300 DPI 微距細節達 <strong>42 cm</strong>、畫廊級 150 DPI 無損直出約 <strong>85 cm</strong>，客廳沙發牆觀賞標準（100–120 DPI）最高可無損印製 <strong>105～127 cm</strong>（適用：居家客廳沙發牆、書房、主臥、玄關）。
                </li>
                <li>
                  <strong style={{color:'var(--gold-l)'}}>8K 巨幅大師版（10,000 像素以上）｜NT$ 2,480：</strong>
                  市場罕見萬級像素原檔！300 DPI 微距細節達 <strong>85 cm</strong>、畫廊級 150 DPI 無損直出高達 <strong>169 cm</strong>，大廳遠距觀賞標準（100–120 DPI）可無損印製 <strong>210～254 cm 巨幅主牆</strong>，放大依然筆觸清晰絕不馬賽克（適用：挑高客廳、豪宅、企業辦公室主位、商業空間）。
                </li>
                <li>建議選擇<strong>藝術微噴（Giclée）</strong>輸出以呈現最佳墨韻與層次。</li>
              </ul>
            </div>

            <div style={{borderTop:'1px dashed var(--border)',paddingTop:'10px',marginBottom:'10px'}}>
              <p style={{fontSize:'0.82rem',fontWeight:'bold',color:'var(--gold-l)',marginBottom:'6px'}}>🖼️ 客製化裝裱與印製建議</p>
              <ul style={{paddingLeft:'16px',fontSize:'0.78rem',lineHeight:'1.6',color:'#d0c5b4'}}>
                <li>1. 推薦選擇側邊包邊（Canvas Wrap）的無框畫，展現藝術品完整氣韻。</li>
                <li>2. 建議選用化纖油畫布（Polyester Canvas）或純棉藝術油畫布（Cotton Canvas）。</li>
                <li>3. 建議至蝦皮購物平台搜尋「客製化無框畫」服務，並直接將檔案傳給店家詢價與訂製。</li>
                <li>4. 避免陽光直射與潮濕環境，以保護作品長久保存。</li>
              </ul>
            </div>

            <div style={{borderTop:'1px dashed var(--border)',paddingTop:'10px'}}>
              <p style={{fontSize:'0.82rem',fontWeight:'bold',color:'var(--gold-l)',marginBottom:'4px'}}>📜 版權與授權說明</p>
              <p style={{fontSize:'0.78rem',lineHeight:'1.6',color:'#d0c5b4'}}>
                購買本站所有五行畫作均只授權使用，而非完整授權；如需提供大量商業需求，或需要其它用途客製化商用特殊圖案，皆歡迎加入官方聯繫方式進一步了解。
              </p>
            </div>
          </div>
          
          <div className="grid">
            {artworks.length === 0 ? (
              <p style={{color:'#d0c5b4',gridColumn:'span 2',textAlign:'center',padding:'15px'}}>正在從雲端載入畫作或目前尚無畫作...</p>
            ) : (
              artworks.map((item, idx) => (
                <div 
                  className="s-card" 
                  key={idx} 
                  id={'art-card-' + idx}
                  style={highlightedArt === item.name ? {border:'1.5px solid var(--gold)', boxShadow:'0 0 14px rgba(212,175,55,0.4)'} : {}}
                >
                  <div>
                    <div style={{position:'relative',marginBottom:'6px'}}>
                      <img 
                        src={item.url} 
                        style={{width:'100%',height:'110px',objectFit:'cover',borderRadius:'6px',cursor:'pointer',display:'block'}} 
                        alt="art" 
                        onClick={() => setActiveImage(item.url)}
                        onContextMenu={(e) => e.preventDefault()} 
                        onDragStart={(e) => e.preventDefault()} 
                      />
                      <span style={{position:'absolute',bottom:'4px',right:'4px',fontSize:'0.55rem',background:'rgba(0,0,0,0.7)',color:'#fff',padding:'2px 4px',borderRadius:'3px'}}>品心美學</span>
                    </div>
                    <div style={{color:'#8f8474',fontSize:'0.62rem',letterSpacing:'0.5px',marginBottom:'2px',wordBreak:'break-all'}}>{item.name}</div>
                    <h4 style={{color:'var(--gold-l)',fontSize:'0.82rem',letterSpacing:'1px'}}>五行開運納福</h4>
                  </div>

                  <div className="art-btn-group">
                    <button
                      type="button"
                      className="btn-art-buy"
                      onClick={() => addToCart(item.name + ' (4K檔)', 1280, item.name + '-4K')}
                    >
                      選購 4K｜$1,280
                    </button>
                    <button
                      type="button"
                      className="btn-art-buy"
                      onClick={() => addToCart(item.name + ' (8K檔)', 2480, item.name + '-8K')}
                    >
                      選購 8K｜$2,480
                    </button>
                    <button
                      type="button"
                      className="btn-art-link"
                      onClick={() => {
                        const url = window.location.origin + '/?art=' + encodeURIComponent(item.name);
                        navigator.clipboard.writeText(url);
                        alert('已複製「' + item.name + '」專屬直達連結！');
                      }}
                    >
                      🔗 複製專屬連結
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </section>

        <section id="legal" className="notice-box">
          <h4>⚖️ 法律責任與版權聲明</h4>
          <ul>
            <li><strong>著作權保護：</strong>本站所有學術文學著作（《生命的出口》、《進階思維的後裔》）、原創藝術畫作及影音內容，均受中華民國著作權法與國際公約保護。</li>
            <li><strong>禁止盜用：</strong>未經書面授權，任何人不得擅自重製、轉載、散布或作商業營利使用，違者必究，將依法追究相關民刑事法律責任。</li>
            <li><strong>免責聲明：</strong>本站提供的數字風水、命理諮詢與心靈文學內容均屬學術研究與哲學探討範疇，不構成任何具體投資、法律或醫療保證。</li>
          </ul>
        </section>

        <footer style={{borderTop:'1px dashed var(--border)',paddingTop:'15px',marginTop:'30px',fontSize:'0.75rem',color:'#d0c5b4',textAlign:'center',display:'flex',flexDirection:'column',gap:'6px'}}>
          <p>© 品心美學 ｜ 學術文學創作 彭品心老師</p>
          <p>官方網站與粉專：<a href="https://www.facebook.com/pengpinxin/" target="_blank" rel="noopener noreferrer" style={{color:'var(--gold-l)',textDecoration:'underline',marginLeft:'4px'}}>https://www.facebook.com/pengpinxin/</a></p>
        </footer>
      </div>

      {activeImage && (
        <div className="lightbox-overlay" onClick={() => setActiveImage(null)}>
          <div className="lightbox-content" onClick={(e) => e.stopPropagation()}>
            <button className="lightbox-close" onClick={() => setActiveImage(null)}>✕ 關閉</button>
            <img 
              src={activeImage} 
              alt="放大預覽" 
              onContextMenu={(e) => e.preventDefault()} 
              onDragStart={(e) => e.preventDefault()} 
            />
          </div>
        </div>
      )}

      <div className="drawer" id="cart">
        <div style={{display:'flex',justifyContent:'space-between',marginBottom:'12px',borderBottom:'1px solid var(--border)',paddingBottom:'8px'}}>
          <h3 style={{color:'var(--gold-l)',fontSize:'0.95rem'}}>🛒 購物車與結帳</h3>
          <button onClick={closeCart} style={{background:'none',border:'none',color:'#fff',fontSize:'1.2rem'}}>✕</button>
        </div>
        
        {isVip && (
          <div style={{background:'rgba(212,175,55,0.15)',border:'1px solid var(--gold)',borderRadius:'6px',padding:'8px',marginBottom:'10px',textAlign:'center'}}>
            <span style={{color:'var(--gold-l)',fontSize:'0.8rem',fontWeight:'bold'}}>👑 尊榮 VIP 9折會員已認證</span>
          </div>
        )}

        <div style={{flexGrow:1,overflowY:'auto',marginBottom:'10px'}}>
          {cart.length === 0 ? (
            <p style={{color:'#d0c5b4',textAlign:'center',padding:'15px'}}>購物車是空的</p>
          ) : (
            cart.map((i, idx) => (
              <div key={idx} style={{display:'flex',justifyContent:'space-between',alignItems:'center',gap:'8px',padding:'6px 0',borderBottom:'1px solid rgba(74,61,49,0.3)',fontSize:'0.75rem'}}>
                <span style={{flex:1,minWidth:0,overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap'}}>{i.name}</span>
                <span style={{flexShrink:0,whiteSpace:'nowrap'}}>NT$ {i.price} <button onClick={() => removeFromCart(idx)} style={{background:'none',border:'none',color:'var(--gold)',cursor:'pointer',marginLeft:'4px',fontSize:'0.75rem'}}>刪除</button></span>
              </div>
            ))
          )}
        </div>
        <div style={{borderTop:'1px solid var(--border)',paddingTop:'10px'}}>
          <div style={{display:'flex',gap:'5px',marginBottom:'8px'}}>
            <input type="text" value={vipCode} onChange={(e) => setVipCode(e.target.value)} placeholder="VIP碼 (VIP880)" style={{margin:0}}/>
            <button className="btn btn-o" onClick={handleVerifyVipCode}>驗證</button>
          </div>
          <div style={{display:'flex',justifyContent:'space-between',fontSize:'0.9rem',fontWeight:'bold',color:'var(--gold-l)',marginBottom:'10px'}}>
            <span>總計：<span>NT$ {total} {vipText}</span></span>
          </div>
          <input type="text" value={cName} onChange={(e) => setCName(e.target.value)} placeholder="姓名"/>
          <input type="text" value={cPhone} onChange={(e) => setCPhone(e.target.value)} onBlur={(e) => checkPhoneVip(e.target.value)} placeholder="已是會員請輸入您的手機號碼即可"/>
          <input type="email" value={cEmail} onChange={(e) => setCEmail(e.target.value)} placeholder="Email"/>
          <input type="text" value={cAddress} onChange={(e) => setCAddress(e.target.value)} placeholder="收件地址"/>
          <textarea value={cRemark} onChange={(e) => setCRemark(e.target.value)} rows="2" placeholder="備註（選填）"></textarea>
          <button className="btn" style={{width:'100%',marginTop:'5px',padding:'10px'}} onClick={handleCheckout} disabled={isCheckingOut}>
            {isCheckingOut ? '正在處理訂單與綠界跳轉...' : '確認送出訂單'}
          </button>
        </div>
      </div>
    </div>
  );
}
