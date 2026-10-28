'use client';
import { useState, useEffect } from 'react';
export default function Home(){
  const [cart, setCart] = useState([]);
  const [isVip, setIsVip] = useState(false);
  const [artworks, setArtworks] = useState([]);
  const [admin, setAdmin] = useState(false);

  useEffect(() => {
    const c = localStorage.getItem('z_cart');
    if(c) setCart(JSON.parse(c));
    const a = localStorage.getItem('z_art');
    if(a){ try{ setArtworks(JSON.parse(a)); }catch(e){ setArtworks([]); } }
  }, []);

  useEffect(() => {
    localStorage.setItem('z_cart', JSON.stringify(cart));
  }, [cart]);

  const add = (n, p) => {
    setCart([...cart, {name: n, price: p}]);
    alert('已將「' + n + '」加入購物車！');
  };

  const rm = (i) => setCart(cart.filter((_, idx) => idx !== i));

  const verify = () => {
    const pwdInput = document.getElementById('ap');
    if(pwdInput && pwdInput.value.trim() === '08241977'){
      setAdmin(true);
      alert('管理員解鎖成功！');
    } else {
      alert('密碼錯誤');
    }
  };

  const handleFileChange = (e) => {
    const f = e.target.files[0];
    if(f){
      const ni = document.getElementById('an');
      if(ni && !ni.value){
        let fn = f.name.substring(0, f.name.lastIndexOf('.')) || f.name;
        let isNum = true;
        for(let k = 0; k < fn.length; k++){
          if(fn.charCodeAt(k) < 48 || fn.charCodeAt(k) > 57){ isNum = false; break; }
        }
        if(isNum || !fn) fn = '品心禪意原創畫作';
        ni.value = fn;
      }
    }
  };

  const up = () => {
    const ni = document.getElementById('an');
    let name = ni?.value.trim() || '品心禪意原創畫作';
    const wm = document.getElementById('aw')?.value.trim() || '品心美學 · 彭品心原創';
    const f = document.getElementById('af')?.files[0];
    if(!f){ alert('請選擇圖片'); return; }
    const r = new FileReader();
    r.readAsDataURL(f);
    r.onload = () => {
      const img = new Image();
      img.onload = () => {
        const size = img.width + ' × ' + img.height + ' px';
        const next = [{name, price: 680, wm, size, img: r.result}, ...artworks];
        setArtworks(next);
        localStorage.setItem('z_art', JSON.stringify(next));
        if(ni) ni.value = '';
        alert('上架成功！尺寸 ' + size);
      };
      img.src = r.result;
    };
  };

  const del = (i) => {
    if(confirm('確定要刪除這幅畫作嗎？')){
      const next = artworks.filter((_, idx) => idx !== i);
      setArtworks(next);
      localStorage.setItem('z_art', JSON.stringify(next));
    }
  };

  // 當使用者輸入電話時，自動檢查是否為已註冊的 VIP 手機號碼
  const checkPhoneVip = (phone) => {
    const vipPhones = JSON.parse(localStorage.getItem('z_vip_phones') || '[]');
    if(vipPhones.includes(phone.trim())){
      setIsVip(true);
      alert('系統自動辨識：此電話已綁定 VIP 880 終身會員，已直接享有 9 折優惠！');
    }
  };

  const chk = () => {
    const n = document.getElementById('cn')?.value.trim();
    const p = document.getElementById('cp')?.value.trim();
    const e = document.getElementById('ce')?.value.trim();
    const a = document.getElementById('ca')?.value.trim();
    if(!n || !p || !e || !a){ alert('請完整填寫收件資訊'); return; }
    if(cart.length === 0){ alert('購物車是空的'); return; }

    // 如果購物車包含 VIP 方案，自動將該電話號碼寫入 VIP 資料庫
    const hasVipItem = cart.some(item => item.name.includes('VIP 880'));
    if(hasVipItem || isVip){
      const vipPhones = JSON.parse(localStorage.getItem('z_vip_phones') || '[]');
      if(!vipPhones.includes(p)){
        vipPhones.push(p);
        localStorage.setItem('z_vip_phones', JSON.stringify(vipPhones));
      }
    }

    alert('感謝 ' + n + ' 緣主！訂單已送出。');
    setCart([]);
    setIsVip(false);
  };

  let total = cart.reduce((s, i) => s + i.price, 0);
  if(isVip) total = Math.round(total * 0.9);
  const vipText = isVip ? ' (已享9折)' : '';

  return (
    <>
      <style jsx global>{`
        :root{--bg:#1a1714;--card:#24201c;--border:#4a3d31;--text:#f3efe6;--gold:#d4af37;--gold-l:#f3e5ab;}
        *{box-sizing:border-box;margin:0;padding:0;font-family:sans-serif;}
        body{background:var(--bg);color:var(--text);line-height:1.6;padding-bottom:60px;}
        header{background:rgba(26,23,20,0.95);border-bottom:1px solid var(--border);padding:10px 15px;position:sticky;top:0;z-index:100;display:flex;justify-content:space-between;align-items:center;}
        .btn{background:linear-gradient(135deg,#d4af37,#aa8c2c);color:#1a1714;border:none;padding:5px 10px;border-radius:14px;font-size:0.75rem;font-weight:bold;cursor:pointer;}
        .btn-o{background:transparent;border:1px solid var(--gold);color:var(--gold-l);}
        .wrap{max-width:750px;margin:0 auto;padding:15px;}
        .card{background:var(--card);border:1px solid var(--border);border-radius:8px;padding:15px;margin-bottom:15px;display:flex;gap:15px;align-items:center;}
        .card img{width:140px;height:85px;object-fit:cover;border-radius:6px;border:1px solid var(--border);}
        .grid{display:grid;grid-template-columns:repeat(2,1fr);gap:12px;margin-bottom:20px;}
        .s-card{background:var(--card);border:1px solid var(--border);border-radius:8px;padding:15px;display:flex;flex-direction:column;justify-content:space-between;}
        .drawer{position:fixed;top:0;right:-100%;width:100%;max-width:320px;height:100%;background:var(--card);border-left:1px solid var(--border);z-index:1000;padding:15px;transition:0.3s;display:flex;flex-direction:column;}
        .drawer.open{right:0;}
        input,textarea{width:100%;padding:8px;margin-bottom:8px;background:#1a1714;border:1px solid var(--border);color:var(--text);border-radius:4px;}
      `}</style>
      <header>
        <div style={{display:'flex',alignItems:'center',gap:'8px'}}>
          <div style={{width:'34px',height:'34px',border:'1px solid var(--gold)',borderRadius:'50%',display:'flex',alignItems:'center',justifyContent:'center',color:'var(--gold)'}}>品</div>
          <div><h1 style={{fontSize:'0.9rem',color:'var(--gold-l)'}}>品心美學</h1><p style={{fontSize:'0.65rem',color:'#d0c5b4'}}>彭品心老師</p></div>
        </div>
        <div style={{display:'flex',gap:'6px'}}>
          <button className="btn" onClick={()=>document.getElementById('cart').classList.add('open')}>🛒({cart.length})</button>
          <button className="btn btn-o" onClick={()=>document.getElementById('menu').classList.add('open')}>☰選單</button>
        </div>
      </header>
      <div className="drawer" id="menu">
        <div style={{display:'flex',justifyContent:'space-between',marginBottom:'15px'}}><h3 style={{color:'var(--gold-l)'}}>導覽</h3><button onClick={()=>document.getElementById('menu').classList.remove('open')} style={{background:'none',border:'none',color:'#fff',fontSize:'1.1rem'}}>✕</button></div>
        <div style={{display:'flex',flexDirection:'column',gap:'12px'}}>
          <a href="#vip" onClick={()=>document.getElementById('menu').classList.remove('open')} style={{color:'var(--gold-l)',textDecoration:'none'}}>💎 VIP 880 會員</a>
          <a href="#books" onClick={()=>document.getElementById('menu').classList.remove('open')} style={{color:'var(--gold-l)',textDecoration:'none'}}>📚 文學著作</a>
          <a href="#services" onClick={()=>document.getElementById('menu').classList.remove('open')} style={{color:'var(--gold-l)',textDecoration:'none'}}>🔮 數字風水</a>
          <a href="#art" onClick={()=>document.getElementById('menu').classList.remove('open')} style={{color:'var(--gold-l)',textDecoration:'none'}}>🎨 原創畫作</a>
        </div>
      </div>
      <div className="wrap">
        <div style={{width:'100%',borderRadius:'8px',overflow:'hidden',border:'1px solid var(--border)',marginBottom:'15px'}}><img src="/1792354723564.png" style={{width:'100%',display:'block'}} alt="b"/></div>
        <div id="vip" style={{background:'rgba(212,175,55,0.08)',border:'1px solid var(--gold)',borderRadius:'8px',padding:'15px',textAlign:'center',marginBottom:'20px'}}>
          <h3 style={{color:'var(--gold-l)',marginBottom:'5px'}}>✨ VIP 880 終身會員</h3>
          <p style={{fontSize:'0.8rem',color:'#d0c5b4',marginBottom:'10px'}}>全館著作、數字配置與畫作<strong>終身9折</strong></p>
          <button className="btn" onClick={()=>add('VIP 880 終身會員方案',880)}>加入 VIP (NT$ 880)</button>
        </div>
        <section id="books">
          <h3 style={{color:'var(--gold-l)',borderLeft:'3px solid var(--gold)',paddingLeft:'8px',margin:'20px 0 12px 0'}}>學術文學著作</h3>
          <div className="card"><img src="/1792440195898.jpg" alt="b1"/><div><h4>生命的出口</h4><div style={{color:'var(--gold)',fontWeight:'bold'}}>NT$ 269</div><p style={{fontSize:'0.8rem',color:'#d0c5b4'}}>心靈轉折與生命出口經典力作。</p><button className="btn btn-o" style={{marginTop:'6px'}} onClick={()=>add('生命的出口',269)}>加入購物車</button></div></div>
          <div className="card"><img src="/1792450518058.jpg" alt="b2"/><div><h4>進階思維的後裔</h4><div style={{color:'var(--gold)',fontWeight:'bold'}}>NT$ 269</div><p style={{fontSize:'0.8rem',color:'#d0c5b4'}}>開啟高維度思維模式與人生格局。</p><button className="btn btn-o" style={{marginTop:'6px'}} onClick={()=>add('進階思維的後裔',269)}>加入購物車</button></div></div>
        </section>
        <section id="services">
          <h3 style={{color:'var(--gold-l)',borderLeft:'3px solid var(--gold)',paddingLeft:'8px',margin:'20px 0 12px 0'}}>紫墨數字風水</h3>
          <div className="grid">
            <div className="s-card"><div><h4>手機號碼配置</h4><div style={{color:'var(--gold)',fontWeight:'bold'}}>NT$ 1,680</div><p style={{fontSize:'0.75rem',color:'#d0c5b4'}}>選定生旺手機吉號。</p></div><button className="btn btn-o" style={{marginTop:'10px'}} onClick={()=>add('手機號碼配置',1680)}>加入</button></div>
            <div className="s-card"><div><h4>車牌號碼配置</h4><div style={{color:'var(--gold)',fontWeight:'bold'}}>NT$ 1,880</div><p style={{fontSize:'0.75rem',color:'#d0c5b4'}}>行車平安磁場加持。</p></div><button className="btn btn-o" style={{marginTop:'10px'}} onClick={()=>add('車牌號碼配置',1880)}>加入</button></div>
            <div className="s-card"><div><h4>住址門牌選吉</h4><div style={{color:'var(--gold)',fontWeight:'bold'}}>NT$ 3,680</div><p style={{fontSize:'0.75rem',color:'#d0c5b4'}}>住宅環境風水選吉。</p></div><button className="btn btn-o" style={{marginTop:'10px'}} onClick={()=>add('住址門牌選吉',3680)}>加入</button></div>
            <div className="s-card"><div><h4>店鋪門牌選吉</h4><div style={{color:'var(--gold)',fontWeight:'bold'}}>NT$ 5,680</div><p style={{fontSize:'0.75rem',color:'#d0c5b4'}}>商舖聚財客源廣進。</p></div><button className="btn btn-o" style={{marginTop:'10px'}} onClick={()=>add('店鋪門牌選吉',5680)}>加入</button></div>
          </div>
        </section>
        <section id="art">
          <h3 style={{color:'var(--gold-l)',borderLeft:'3px solid var(--gold)',paddingLeft:'8px',margin:'20px 0 12px 0'}}>原創藝術畫作 (NT$ 680)</h3>
          {!admin?(
            <div style={{background:'rgba(212,175,55,0.05)',border:'1px dashed var(--gold)',borderRadius:'8px',padding:'15px',textAlign:'center',marginBottom:'15px'}}>
              <p style={{fontSize:'0.8rem',color:'var(--gold-l)',marginBottom:'8px'}}>🔒 老師專用管理上傳</p>
              <input type="password" id="ap" placeholder="請輸入管理密碼" style={{maxWidth:'240px',margin:'0 auto 8px auto',display:'block'}}/>
              <button className="btn btn-o" onClick={verify}>解鎖上傳</button>
            </div>
          ):(
            <div style={{background:'rgba(212,175,55,0.05)',border:'1px dashed var(--gold)',borderRadius:'8px',padding:'15px',marginBottom:'15px'}}>
              <div style={{display:'flex',justifyContent:'space-between',marginBottom:'8px'}}><span style={{color:'var(--gold-l)',fontSize:'0.85rem'}}>🎨 畫作上傳區</span><button className="btn btn-o" style={{fontSize:'0.6rem'}} onClick={()=>setAdmin(false)}>登出</button></div>
              <input type="text" id="an" placeholder="請輸入中文畫名（未填自動命名）"/>
              <input type="text" id="aw" defaultValue="品心美學 · 彭品心原創" placeholder="浮水印文字"/>
              <input type="file" id="af" accept="image/*" onChange={handleFileChange}/>
              <button className="btn" style={{width:'100%',marginTop:'5px'}} onClick={up}>確認上架 (NT$ 680)</button>
            </div>
          )}
          <div className="grid">
            {artworks.length===0?(<p style={{color:'#d0c5b4',gridColumn:'span 2',textAlign:'center',padding:'15px'}}>目前尚無畫作</p>):(
              artworks.map((item,idx)=>(
                <div className="s-card" key={idx}>
                  <div>
                    <div style={{position:'relative',marginBottom:'6px'}}>
                      <img src={item.img} style={{width:'100%',height:'110px',objectFit:'cover',borderRadius:'6px'}} alt="art"/>
                      <span style={{position:'absolute',bottom:'4px',right:'4px',fontSize:'0.55rem',background:'rgba(0,0,0,0.7)',color:'#fff',padding:'2px 4px',borderRadius:'3px'}}>{item.wm}</span>
                    </div>
                    <h4 style={{color:'var(--gold-l)',fontSize:'0.85rem'}}>{item.name}</h4>
                    <p style={{fontSize:'0.7rem',color:'var(--gold-l)',margin:'4px 0'}}>📏 {item.size}</p>
                    <div style={{color:'var(--gold)',fontWeight:'bold',fontSize:'0.85rem'}}>NT$ {item.price}</div>
                  </div>
                  <div style={{marginTop:'8px',display:'flex',flexDirection:'column',gap:'4px'}}>
                    <button className="btn btn-o" style={{width:'100%',fontSize:'0.7rem'}} onClick={()=>add(item.name,680)}>加入購物車</button>
                    {admin && (
                      <button className="btn" style={{width:'100%',fontSize:'0.7rem',background:'#8b0000',color:'#fff'}} onClick={()=>del(idx)}>刪除此畫作</button>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        </section>
        <footer style={{borderTop:'1px dashed var(--border)',paddingTop:'15px',marginTop:'30px',fontSize:'0.7rem',color:'#d0c5b4',textAlign:'center'}}>
          <p>© 品心美學 ｜ 學術文學創作 彭品心老師</p>
        </footer>
      </div>
      <div className="drawer" id="cart">
        <div style={{display:'flex',justifyContent:'space-between',marginBottom:'12px',borderBottom:'1px solid var(--border)',paddingBottom:'8px'}}><h3 style={{color:'var(--gold-l)',fontSize:'0.95rem'}}>🛒 購物車與結帳</h3><button onClick={()=>document.getElementById('cart').classList.remove('open')} style={{background:'none',border:'none',color:'#fff',fontSize:'1.1rem'}}>✕</button></div>
        <div style={{flexGrow:1,overflowY:'auto',marginBottom:'10px'}}>
          {cart.length===0?(<p style={{color:'#d0c5b4',textAlign:'center',padding:'15px'}}>購物車是空的</p>):(
            cart.map((i,idx)=>(<div key={idx} style={{display:'flex',justifyContent:'space-between',padding:'6px 0',borderBottom:'1px solid rgba(74,61,49,0.3)',fontSize:'0.8rem'}}><span>{i.name}</span><span>NT$ {i.price} <button onClick={()=>rm(idx)} style={{background:'none',border:'none',color:'var(--gold)',cursor:'pointer',marginLeft:'6px'}}>刪除</button></span></div>))
          )}
        </div>
        <div style={{borderTop:'1px solid var(--border)',paddingTop:'10px'}}>
          <div style={{display:'flex',gap:'5px',marginBottom:'8px'}}>
            <input type="text" id="vc" placeholder="VIP碼 (VIP880)" style={{margin:0}}/>
            <button className="btn btn-o" onClick={()=>{if(document.getElementById('vc').value.trim()==='VIP880'){setIsVip(true);alert('VIP 驗證成功');}else{alert('錯誤');}}>驗證</button>
          </div>
          <div style={{display:'flex',justifyContent:'space-between',fontSize:'0.9rem',fontWeight:'bold',color:'var(--gold-l)',marginBottom:'10px'}}>
            <span>總計：</span><span>NT$ {total} {vipText}</span>
          </div>
          <input type="text" id="cn" placeholder="姓名"/>
          <input type="text" id="cp" placeholder="電話" onBlur={(e)=>checkPhoneVip(e.target.value)}/>
          <input type="email" id="ce" placeholder="Email"/>
          <input type="text" id="ca" placeholder="收件地址"/>
          <textarea id="co" rows="1" placeholder="備註（選填）"></textarea>
          <button className="btn" style={{width:'100%',marginTop:'5px',padding:'8px'}} onClick={chk}>確認送出訂單</button>
        </div>
      </div>
    </>
  );
            }
