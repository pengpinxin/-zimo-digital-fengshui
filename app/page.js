'use client';
import { useState, useEffect } from 'react';

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

  let total = cart.reduce((s, i) => s + i.price, 0);
  if(isVip) total = Math.round(total * 0.9);
  const vipText = isVip ? ' (已享 VIP 9折)' : '';

  const openCart = () => document.getElementById('cart')?.classList.add('open');
  const closeCart = () => document.getElementById('cart')?.classList.remove('open');
  const openMenu = () => document.getElementById('menu')?.classList.add('open');
  const closeMenu = () => document.getElementById('menu')?.classList.remove('open');

  useEffect(() => {
    const c = localStorage.getItem('z_cart');
    if(c){ try{ setCart(JSON.parse(c)); }catch(e){} }

    fetch('/api/artworks')
      .then(res => res.json())
      .then(data => {
        if (data.success && data.artworks) {
          setArtworks(data.artworks);
        } else {
          const a = localStorage.getItem('z_artworks');
          if(a){ try{ setArtworks(JSON.parse(a)); }catch(e){} }
        }
      })
      .catch(() => {
        const a = localStorage.getItem('z_artworks');
        if(a){ try{ setArtworks(JSON.parse(a)); }catch(e){} }
      });
  }, []);

  useEffect(() => {
    localStorage.setItem('z_cart', JSON.stringify(cart));
  }, [cart]);

  const addToCart = (name, price) => {
    setCart(prev => [...prev, { name, price }]);
    alert('已將「' + name + '」加入購物車！');
    openCart();
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

  const handleCheckout = async () => {
    if (!cName || !cPhone || !cEmail) {
      alert('請填寫完整聯絡資訊');
      return;
    }
    if (cart.length === 0) {
      alert('購物車是空的');
      return;
    }

    const itemName = cart.map(i => i.name).join(', ');

    try {
      const res = await fetch('/api/ecpay', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          totalAmount: total,
          itemName: itemName,
          customerName: cName,
          customerPhone: cPhone,
          customerEmail: cEmail
        })
      });
      const data = await res.json();
      if (!data.success) {
        alert('失敗：' + data.error);
        return;
      }

      const form = document.createElement('form');
      form.method = 'POST';
      form.action = data.ECPayURL;
      for (const key in data.params) {
        const input = document.createElement('input');
        input.type = 'hidden';
        input.name = key;
        input.value = data.params[key];
        form.appendChild(input);
      }
      document.body.appendChild(form);
      form.submit();
    } catch (err) {
      alert('錯誤：' + err.message);
    }
  };

  return (
    <>
      <style jsx global>{`
        :root{--bg:#1a1714;--card:#24201c;--gold:#c5a880;--gold-l:#d4af37;--border:#4a3d31;}
        *{box-sizing:border-box;margin:0;padding:0;}
        body{background:var(--bg);color:#e6e2dd;font-family:sans-serif;}
        header{background:rgba(26,23,20,0.9);position:sticky;top:0;z-index:100;padding:12px 16px;display:flex;justify-content:space-between;align-items:center;border-bottom:1px solid var(--border);}
        .btn{background:var(--gold);color:#1a1714;padding:8px 16px;border:none;border-radius:4px;font-weight:bold;cursor:pointer;}
        .btn-o{background:transparent;border:1px solid var(--gold);color:var(--gold);}
        .wrap{max-width:750px;margin:0 auto;padding:16px;}
        .card{background:var(--card);border:1px solid var(--border);border-radius:8px;padding:16px;margin-bottom:16px;}
        .grid{display:grid;grid-template-columns:1fr;gap:16px;}
        .drawer{position:fixed;top:0;right:-100%;width:100%;max-width:380px;height:100%;background:var(--card);z-index:1000;padding:20px;box-shadow:-5px 0 15px rgba(0,0,0,0.5);transition:right 0.3s ease;display:flex;flex-direction:column;border-left:1px solid var(--border);}
        .drawer.open{right:0;}
        input,textarea{width:100%;padding:10px;margin-bottom:10px;background:#1a1714;color:#fff;border:1px solid var(--border);border-radius:5px;}
      `}</style>

      <header>
        <div style={{display:'flex',alignItems:'center',gap:'10px'}}>
          <div style={{width:'34px',height:'34px',background:'var(--gold)',borderRadius:'4px',display:'flex',alignItems:'center',justifyContent:'center',fontWeight:'bold',color:'#1a1714'}}>品</div>
          <div>
            <h1 style={{fontSize:'0.9rem',color:'var(--gold-l)'}}>品心美學</h1>
            <p style={{fontSize:'0.65rem',color:'#b0a699'}}>Pin Xin Aesthetics</p>
          </div>
        </div>
        <div style={{display:'flex',gap:'6px'}}>
          <button className="btn" onClick={openCart}>購物車 ({cart.length})</button>
          <button className="btn btn-o" onClick={openMenu}>選單</button>
        </div>
      </header>

      <div className="drawer" id="menu">
        <div style={{display:'flex',justifyContent:'space-between',marginBottom:'20px'}}>
          <h3 style={{color:'var(--gold-l)'}}>導覽選單</h3>
          <button onClick={closeMenu} style={{background:'none',border:'none',color:'#fff',fontSize:'1.2rem'}}>✕</button>
        </div>
        <div style={{display:'flex',flexDirection:'column',gap:'12px'}}>
          <a href="#vip" onClick={closeMenu} style={{color:'#e6e2dd',textDecoration:'none'}}>VIP 專區</a>
          <a href="#intro" onClick={closeMenu} style={{color:'#e6e2dd',textDecoration:'none'}}>關於老師</a>
          <a href="#books" onClick={closeMenu} style={{color:'#e6e2dd',textDecoration:'none'}}>學術著作</a>
          <a href="#services" onClick={closeMenu} style={{color:'#e6e2dd',textDecoration:'none'}}>命理服務</a>
          <a href="#art" onClick={closeMenu} style={{color:'#e6e2dd',textDecoration:'none'}}>書畫藝廊</a>
          <a href="#contact" onClick={closeMenu} style={{color:'#e6e2dd',textDecoration:'none'}}>聯絡資訊</a>
          <a href="#legal" onClick={closeMenu} style={{color:'#e6e2dd',textDecoration:'none'}}>法律聲明</a>
        </div>
      </div>

      <div className="wrap">
        <div className="card" style={{textAlign:'center',padding:'24px 16px'}}>
          <h2 style={{color:'var(--gold-l)',marginBottom:'8px'}}>品心書閣 & 紫墨禪音</h2>
          <p style={{fontSize:'0.85rem',color:'#b0a699'}}>學術文學創作者、數字命理與東方美學空間</p>
        </div>

        <section id="vip" className="card">
          <h3 style={{color:'var(--gold-l)',marginBottom:'8px'}}>👑 VIP 會員專區</h3>
          <p style={{fontSize:'0.8rem',color:'#b0a699',marginBottom:'12px'}}>輸入專屬 VIP 碼即可享全館商品 9 折優惠。</p>
          <div style={{display:'flex',gap:'8px'}}>
            <input type="text" placeholder="請輸入VIP碼" value={vipCode} onChange={e => setVipCode(e.target.value)} style={{margin:0}} />
            <button className="btn" onClick={handleVerifyVipCode}>驗證</button>
          </div>
        </section>

        <section id="intro" className="card">
          <h2 style={{color:'var(--gold-l)',marginBottom:'10px'}}>關於老師</h2>
          <p style={{fontSize:'0.85rem',lineHeight:'1.6',marginBottom:'10px'}}>喧囂的世間，每個人都在找尋安放靈魂的角落。品心老師致力於融合學術文學、東方書畫、禪意音樂與數字命理。</p>
        </section>

        <section id="books" className="card">
          <h3 style={{color:'var(--gold-l)',marginBottom:'12px'}}>學術著作</h3>
          <div className="grid">
            <div style={{background:'rgba(0,0,0,0.2)',padding:'12px',borderRadius:'6px',display:'flex',justifyContent:'space-between',alignItems:'center'}}>
              <div>
                <h4 style={{fontSize:'0.9rem',color:'#fff'}}>《生命的出口》</h4>
                <p style={{fontSize:'0.75rem',color:'var(--gold)'}}>NT$ 269</p>
              </div>
              <button className="btn" onClick={() => addToCart('生命的出口', 269)}>購買</button>
            </div>
            <div style={{background:'rgba(0,0,0,0.2)',padding:'12px',borderRadius:'6px',display:'flex',justifyContent:'space-between',alignItems:'center'}}>
              <div>
                <h4 style={{fontSize:'0.9rem',color:'#fff'}}>《進階思維的後裔》</h4>
                <p style={{fontSize:'0.75rem',color:'var(--gold)'}}>NT$ 269</p>
              </div>
              <button className="btn" onClick={() => addToCart('進階思維的後裔', 269)}>購買</button>
            </div>
          </div>
        </section>

        <section id="services" className="card">
          <h3 style={{color:'var(--gold-l)',marginBottom:'12px'}}>專業命理服務</h3>
          <div className="grid">
            <div style={{background:'rgba(0,0,0,0.2)',padding:'12px',borderRadius:'6px',display:'flex',justifyContent:'space-between',alignItems:'center'}}>
              <div>
                <h4 style={{fontSize:'0.9rem',color:'#fff'}}>八字批算服務</h4>
                <p style={{fontSize:'0.75rem',color:'var(--gold)'}}>NT$ 1200</p>
              </div>
              <button className="btn" onClick={() => addToCart('八字批算服務', 1200)}>預約</button>
            </div>
            <div style={{background:'rgba(0,0,0,0.2)',padding:'12px',borderRadius:'6px',display:'flex',justifyContent:'space-between',alignItems:'center'}}>
              <div>
                <h4 style={{fontSize:'0.9rem',color:'#fff'}}>數字風水與吉數選擇</h4>
                <p style={{fontSize:'0.75rem',color:'var(--gold)'}}>NT$ 880</p>
              </div>
              <button className="btn" onClick={() => addToCart('數字風水與吉數選擇', 880)}>預約</button>
            </div>
          </div>
        </section>

        <section id="art" className="card">
          <h3 style={{color:'var(--gold-l)',marginBottom:'12px'}}>書畫藝廊</h3>
          <div className="grid">
            {artworks.length === 0 ? (
              <p style={{fontSize:'0.8rem',color:'#b0a699',textAlign:'center'}}>載入藝廊作品中...</p>
            ) : (
              artworks.map((item, idx) => (
                <div key={idx} style={{background:'rgba(0,0,0,0.2)',padding:'12px',borderRadius:'6px'}}>
                  <img src={item.url} alt={item.name} style={{width:'100%',height:'160px',objectFit:'cover',borderRadius:'4px',marginBottom:'8px'}} />
                  <div style={{display:'flex',justifyContent:'space-between',alignItems:'center'}}>
                    <span style={{fontSize:'0.85rem',color:'#fff'}}>{item.name}</span>
                    <button className="btn" onClick={() => addToCart(item.name, item.price || 1500)}>收藏 NT$ {item.price || 1500}</button>
                  </div>
                </div>
              ))
            )}
          </div>
        </section>

        <section id="contact" className="card">
          <h3 style={{color:'var(--gold-l)',marginBottom:'8px'}}>聯絡資訊</h3>
          <p style={{fontSize:'0.8rem',color:'#b0a699',marginBottom:'4px'}}>官方主頁：<a href="https://www.facebook.com/pengpinxin/" target="_blank" style={{color:'var(--gold)'}}>Facebook 主頁</a></p>
          <p style={{fontSize:'0.8rem',color:'#b0a699'}}>電子信箱：Aaa0987955906aaa@gmail.com</p>
        </section>

        <section id="legal" className="card">
          <h4 style={{color:'var(--gold-l)',fontSize:'0.85rem',marginBottom:'6px'}}>⚖️ 法律責任與版權聲明</h4>
          <p style={{fontSize:'0.75rem',color:'#b0a699',lineHeight:'1.5'}}>本網站所有學術著作、書畫藝術品及命理服務內容均受版權保護，翻印必究。</p>
        </section>
      </div>

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
              <div key={idx} style={{display:'flex',justifyContent:'space-between',padding:'6px 0',borderBottom:'1px solid rgba(74,61,49,0.3)',fontSize:'0.8rem'}}>
                <span>{i.name}</span>
                <span>NT$ {i.price} <button onClick={() => removeFromCart(idx)} style={{background:'none',border:'none',color:'var(--gold)',cursor:'pointer',marginLeft:'6px'}}>刪除</button></span>
              </div>
            ))
          )}
        </div>

        <div style={{borderTop:'1px solid var(--border)',paddingTop:'10px'}}>
          <div style={{display:'flex',gap:'5px',marginBottom:'8px'}}>
            <input type="text" value={vipCode} onChange={e => setVipCode(e.target.value)} placeholder="VIP碼 (VIP880)" style={{margin:0}}/>
            <button className="btn btn-o" onClick={handleVerifyVipCode}>驗證</button>
          </div>
          <div style={{display:'flex',justifyContent:'space-between',fontSize:'0.9rem',fontWeight:'bold',color:'var(--gold-l)',marginBottom:'10px'}}>
            <span>總計：<span>NT$ {total} {vipText}</span></span>
          </div>

          <input type="text" placeholder="姓名" value={cName} onChange={e => setCName(e.target.value)} />
          <input type="text" placeholder="電話" value={cPhone} onChange={e => setCPhone(e.target.value)} />
          <input type="email" placeholder="信箱" value={cEmail} onChange={e => setCEmail(e.target.value)} />
          <input type="text" placeholder="地址" value={cAddress} onChange={e => setCAddress(e.target.value)} />
          <textarea placeholder="備註" value={cRemark} onChange={e => setCRemark(e.target.value)} style={{height:'60px'}} />
          <button className="btn" onClick={handleCheckout} style={{width:'100%', padding:'12px', background:'#c5a880', color:'#1a1714', fontWeight:'bold', border:'none', borderRadius:'5px', cursor:'pointer'}}>確認結帳</button>
        </div>
      </div>
    </>
  );
}
