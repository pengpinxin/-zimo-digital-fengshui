'use client';
import { useState, useEffect } from 'react';

export default function Home(){
  const [cart, setCart] = useState([]);
  const [isVip, setIsVip] = useState(false);
  const [artworks, setArtworks] = useState([]);
  const [admin, setAdmin] = useState(false);
  const [adminPwd, setAdminPwd] = useState('');
  const [artName, setArtName] = useState('');
  const [artWm, setArtWm] = useState('品心美學 · 彭品心原創');
  const [vipCode, setVipCode] = useState('');
  const [cName, setCName] = useState('');
  const [cPhone, setCPhone] = useState('');
  const [cEmail, setCEmail] = useState('');
  const [cAddress, setCAddress] = useState('');
  const [cRemark, setCRemark] = useState('');
  const [selectedFile, setSelectedFile] = useState(null);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    const c = localStorage.getItem('z_cart');
    if(c){ try{ setCart(JSON.parse(c)); }catch(e){ setCart([]); } }
    const a = localStorage.getItem('z_art');
    if(a){ try{ setArtworks(JSON.parse(a)); }catch(e){ setArtworks([]); } }
  }, []);

  useEffect(() => {
    localStorage.setItem('z_cart', JSON.stringify(cart));
  }, [cart]);

  const addToCart = (name, price) => {
    setCart(prev => [...prev, { name, price }]);
    alert('已將「' + name + '」加入購物車！');
  };

  const removeFromCart = (index) => {
    setCart(prev => prev.filter((_, idx) => idx !== index));
  };

  const handleVerifyAdmin = () => {
    if(adminPwd.trim() === '08241977'){
      setAdmin(true);
      alert('管理員解鎖成功！');
    } else {
      alert('密碼錯誤');
    }
  };

  const handleFileChange = (e) => {
    const f = e.target.files[0];
    if(f){
      setSelectedFile(f);
      if(!artName){
        let fn = f.name.substring(0, f.name.lastIndexOf('.')) || f.name;
        setArtName(fn);
      }
    }
  };

  const handleUploadArt = async () => {
    if(!selectedFile){ alert('請選擇圖片檔案'); return; }
    const nameToUse = artName.trim() || '品心禪意原創畫作';
    setUploading(true);
    
    const formData = new FormData();
    formData.append('file', selectedFile);
    formData.append('filename', selectedFile.name);

    try {
      const res = await fetch('/api/upload', { method: 'POST', body: formData });
      const data = await res.json();
      if(data.success) {
        const next = [{name: nameToUse, price: 680, wm: artWm, size: 'GitHub 雲端永久保存', img: data.url}, ...artworks];
        setArtworks(next);
        localStorage.setItem('z_art', JSON.stringify(next));
        setArtName('');
        setSelectedFile(null);
        alert('成功上傳並永久儲存至 GitHub 雲端！');
      } else {
        alert('上傳失敗：' + (data.error || '未知錯誤'));
      }
    } catch (err) {
      alert('連線伺服器發生錯誤');
    } finally {
      setUploading(false);
    }
  };

  const handleDeleteArt = (index) => {
    if(confirm('確定要刪除這幅畫作嗎？')){
      const next = artworks.filter((_, idx) => idx !== index);
      setArtworks(next);
      localStorage.setItem('z_art', JSON.stringify(next));
    }
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

  const handleCheckout = () => {
    if(!cName || !cPhone || !cEmail || !cAddress){ alert('請完整填寫收件與聯絡資訊'); return; }
    if(cart.length === 0){ alert('購物車是空的'); return; }

    const hasVipItem = cart.some(item => item.name.includes('VIP 880'));
    if(hasVipItem || isVip){
      const vipPhones = JSON.parse(localStorage.getItem('z_vip_phones') || '[]');
      if(!vipPhones.includes(cPhone)){
        vipPhones.push(cPhone);
        localStorage.setItem('z_vip_phones', JSON.stringify(vipPhones));
      }
    }

    alert('感謝 ' + cName + ' 緣主！訂單已送出。');
    setCart([]);
    setIsVip(false);
    setCName(''); setCPhone(''); setCEmail(''); setCAddress(''); setCRemark('');
  };

  const openCart = () => document.getElementById('cart')?.classList.add('open');
  const closeCart = () => document.getElementById('cart')?.classList.remove('open');
  const openMenu = () => document.getElementById('menu')?.classList.add('open');
  const closeMenu = () => document.getElementById('menu')?.classList.remove('open');

  let total = cart.reduce((s, i) => s + i.price, 0);
  if(isVip) total = Math.round(total * 0.9);
  const vipText = isVip ? ' (已享 VIP 9折)' : '';

  return (
    <>
      <style jsx global>{`
        :root{--bg:#1a1714;--card:#24201c;--border:#4a3d31;--text:#f3efe6;--gold:#d4af37;--gold-l:#f3e5ab;}
        *{box-sizing:border-box;margin:0;padding:0;font-family:sans-serif;}
        body{background:var(--bg);color:var(--text);line-height:1.6;padding-bottom:60px;}
        header{background:rgba(26,23,20,0.95);border-bottom:1px solid var(--border);padding:10px 15px;position:sticky;top:0;z-index:100;display:flex;justify-content:space-between;align-items:center;}
        .btn{background:linear-gradient(135deg,#d4af37,#aa8c2c);color:#1a1714;border:none;padding:6px 12px;border-radius:14px;font-size:0.75rem;font-weight:bold;cursor:pointer;}
        .btn-o{background:transparent;border:1px solid var(--gold);color:var(--gold-l);}
        .wrap{max-width:750px;margin:0 auto;padding:15px;}
        .card{background:var(--card);border:1px solid var(--border);border-radius:8px;padding:15px;margin-bottom:15px;display:flex;gap:15px;align-items:center;}
        .card img{width:140px; aspect-ratio:16/9; object-fit:cover; border-radius:6px; border:1px solid var(--border);}
        .grid{display:grid;grid-template-columns:repeat(2,1fr);gap:12px;margin-bottom:20px;}
        .s-card{background:var(--card);border:1px solid var(--border);border-radius:8px;padding:15px;display:flex;flex-direction:column;justify-content:space-between;}
        .drawer{position:fixed;top:0;right:-100%;width:100%;max-width:320px;height:100%;background:var(--card);border-left:1px solid var(--border);z-index:1000;padding:15px;transition:0.3s;display:flex;flex-direction:column;overflow-y:auto;}
        .drawer.open{right:0;}
        input,textarea{width:100%;padding:10px;margin-bottom:8px;background:#1a1714;border:1px solid var(--border);color:var(--text);border-radius:6px;font-size:0.9rem;}
        .notice-box{background:rgba(212,175,55,0.05);border:1px solid var(--border);border-radius:8px;padding:15px;margin:15px 0;font-size:0.8rem;color:#d0c5b4;}
        .notice-box h4{color:var(--gold-l);margin-bottom:8px;font-size:0.9rem;}
        .notice-box ul{padding-left:18px;}
        .notice-box li{margin-bottom:4px;}
      `}</style>

      <header>
        <div style={{display:'flex',alignItems:'center',gap:'8px'}}>
          <div style={{width:'34px',height:'34px',border:'1px solid var(--gold)',borderRadius:'50%',display:'flex',alignItems:'center',justifyContent:'center',color:'var(--gold)'}}>品</div>
          <div>
            <h1 style={{fontSize:'0.9rem',color:'var(--gold-l)'}}>品心美學</h1>
            <p style={{fontSize:'0.65rem',color:'#d0c5b4'}}>彭品心老師官方網站</p>
          </div>
        </div>
        <div style={{display:'flex',gap:'6px'}}>
          <button className="btn" onClick={openCart}>🛒購物車({cart.length})</button>
          <button className="btn btn-o" onClick={openMenu}>☰選單</button>
        </div>
      </header>

      <div className="drawer" id="menu">
        <div style={{display:'flex',justifyContent:'space-between',marginBottom:'15px'}}><h3 style={{color:'var(--gold-l)'}}>導覽</h3><button onClick={closeMenu} style={{background:'none',border:'none',color:'#fff',fontSize:'1.2rem'}}>✕</button></div>
        <div style={{display:'flex',flexDirection:'column',gap:'12px'}}>
          <a href="#vip" onClick={closeMenu} style={{color:'var(--gold-l)',textDecoration:'none'}}>💎 VIP 880 會員專屬福利</a>
          <a href="#intro" onClick={closeMenu} style={{color:'var(--gold-l)',textDecoration:'none'}}>📖 靈魂的棲息之處</a>
          <a href="#books" onClick={closeMenu} style={{color:'var(--gold-l)',textDecoration:'none'}}>📚 學術文學著作</a>
          <a href="#services" onClick={closeMenu} style={{color:'var(--gold-l)',textDecoration:'none'}}>🔮 紫墨數字風水</a>
          <a href="#art" onClick={closeMenu} style={{color:'var(--gold-l)',textDecoration:'none'}}>🎨 原創藝術畫作</a>
          <a href="#contact" onClick={closeMenu} style={{color:'var(--gold-l)',textDecoration:'none'}}>📞 聯絡方式</a>
          <a href="#legal" onClick={closeMenu} style={{color:'var(--gold-l)',textDecoration:'none'}}>⚖️ 法律責任與聲明</a>
        </div>
      </div>

      <div className="wrap">
        <div style={{width:'100%',borderRadius:'8px',overflow:'hidden',border:'1px solid var(--border)',marginBottom:'15px'}}><img src="/1792354723564.png" style={{width:'100%',display:'block'}} alt="b"/></div>
        
        <div id="vip" style={{background:'rgba(212,175,55,0.08)',border:'1px solid var(--gold)',borderRadius:'8px',padding:'15px',textAlign:'center',marginBottom:'20px'}}>
          <h3 style={{color:'var(--gold-l)',marginBottom:'5px'}}>✨ VIP 880 會員專屬福利</h3>
          <p style={{fontSize:'0.8rem',color:'#d0c5b4',marginBottom:'10px'}}>享有全館著作、數字配置與原創畫作<strong>終身九折</strong>禮遇！</p>
          <button className="btn" onClick={()=>addToCart('VIP 880 終身會員方案',880)}>加入 VIP 880 方案 (NT$ 880)</button>
        </div>

        <section id="intro" className="notice-box" style={{textAlign:'center',padding:'20px'}}>
          <h2 style={{color:'var(--gold-l)',fontSize:'1.2rem',marginBottom:'12px'}}>靈魂的棲息之處</h2>
          <p style={{fontSize:'0.85rem',color:'#f3efe6',marginBottom:'12px',lineHeight:'1.8'}}>喧囂的世間，每個人都在找尋安放靈魂的角落，這裡是開運、療癒、藝術與和諧於一體的心靈家園，品心&紫墨老師歡迎您的到來！</p>
          <p style={{fontSize:'0.8rem',color:'#d0c5b4',lineHeight:'1.8',textAlign:'left'}}>老師十歲繼承家祖爺爺精準測字絕學，傾於一生對數字、文學、玄學、及各學術類的興趣，藏拙於一身靈性與道行，歷經幾十載世俗的考驗，她清雅脫俗地出落在紅塵萬里天地之間，悉心等待著值得的人送去福音，將她畢生的學術研究成果，盡心耕織於人類與環境實際需求，廣結善緣、讓福音傳遍千里之外，讓靈慧助人於無形之中。</p>
        </section>

        <section id="books">
          <h3 style={{color:'var(--gold-l)',borderLeft:'3px solid var(--gold)',paddingLeft:'8px',margin:'20px 0 6px 0'}}>學術文學著作</h3>
          <p style={{fontSize:'0.75rem',color:'#d0c5b4',marginBottom:'12px',paddingLeft:'4px'}}>彭品心老師深具靈性與學術深度的經典力作，引領讀者開啟高維度思維與生命轉折。</p>
          <div className="card"><img src="/1792440195898.jpg" alt="b1"/><div><h4>生命的出口</h4><div style={{color:'var(--gold)',fontWeight:'bold'}}>NT$ 269</div><p style={{fontSize:'0.8rem',color:'#d0c5b4'}}>心靈轉折與生命出口經典力作。</p><button className="btn btn-o" style={{marginTop:'6px'}} onClick={()=>addToCart('生命的出口',269)}>加入購物車</button></div></div>
          <div className="card"><img src="/1792450518058.jpg" alt="b2"/><div><h4>進階思維的後裔</h4><div style={{color:'var(--gold)',fontWeight:'bold'}}>NT$ 269</div><p style={{fontSize:'0.8rem',color:'#d0c5b4'}}>開啟高維度思維模式與人生格局。</p><button className="btn btn-o" style={{marginTop:'6px'}} onClick={()=>addToCart('進階思維的後裔',269)}>加入購物車</button></div></div>
        </section>

        <section id="services">
          <h3 style={{color:'var(--gold-l)',borderLeft:'3px solid var(--gold)',paddingLeft:'8px',margin:'20px 0 8px 0'}}>紫墨數字風水</h3>
          <div className="notice-box" style={{marginTop:'0', marginBottom:'12px'}}>
            <h4 style={{color:'var(--gold-l)',marginBottom:'6px'}}>📌 四大服務購買注意事項</h4>
            <ul style={{paddingLeft:'16px',fontSize:'0.75rem'}}>
              <li><strong>專業排盤與配置：</strong>各項數字風水服務（手機、車牌、住址、店鋪選吉）皆由彭品心老師親自依據專業學術與磁場原理規劃。</li>
              <li><strong>資料提供：</strong>請於訂單備註或聯絡時提供正確之號碼及相關需求，以確保配置精準。</li>
              <li><strong>服務性質：</strong>數位與命理客製化配置服務確認開始執行後，恕不接受無理由退款。</li>
              <li><strong>理性參考：</strong>所有風水磁場與號碼配置旨在輔助提升運勢與心境，個人努力與正念亦為成就之本。</li>
            </ul>
          </div>
          <div className="grid">
            <div className="s-card"><div><h4>手機號碼配置</h4><div style={{color:'var(--gold)',fontWeight:'bold'}}>NT$ 1,680</div><p style={{fontSize:'0.75rem',color:'#d0c5b4'}}>選定生旺手機吉號。</p></div><button className="btn btn-o" style={{marginTop:'10px'}} onClick={()=>addToCart('手機號碼配置',1680)}>加入</button></div>
            <div className="s-card"><div><h4>車牌號碼配置</h4><div style={{color:'var(--gold)',fontWeight:'bold'}}>NT$ 1,880</div><p style={{fontSize:'0.75rem',color:'#d0c5b4'}}>行車平安磁場加持。</p></div><button className="btn btn-o" style={{marginTop:'10px'}} onClick={()=>addToCart('車牌號碼配置',1880)}>加入</button></div>
            <div className="s-card"><div><h4>住址門牌選吉</h4><div style={{color:'var(--gold)',fontWeight:'bold'}}>NT$ 3,680</div><p style={{fontSize:'0.75rem',color:'#d0c5b4'}}>住宅環境風水選吉。</p></div><button className="btn btn-o" style={{marginTop:'10px'}} onClick={()=>addToCart('住址門牌選吉',3680)}>加入</button></div>
            <div className="s-card"><div><h4>店鋪門牌選吉</h4><div style={{color:'var(--gold)',fontWeight:'bold'}}>NT$ 5,680</div><p style={{fontSize:'0.75rem',color:'#d0c5b4'}}>商舖聚財客源廣進。</p></div><button className="btn btn-o" style={{marginTop:'10px'}} onClick={()=>addToCart('店鋪門牌選吉',5680)}>加入</button></div>
          </div>
        </section>

        <section id="art">
          <h3 style={{color:'var(--gold-l)',borderLeft:'3px solid var(--gold)',paddingLeft:'8px',margin:'20px 0 12px 0'}}>原創藝術畫作 (NT$ 680)</h3>
          {!admin?(
            <div style={{background:'rgba(212,175,55,0.05)',border:'1px dashed var(--gold)',borderRadius:'8px',padding:'15px',textAlign:'center',marginBottom:'15px'}}>
              <p style={{fontSize:'0.8rem',color:'var(--gold-l)',marginBottom:'8px'}}>🔒 老師專用管理上傳</p>
              <input type="password" value={adminPwd} onChange={(e)=>setAdminPwd(e.target.value)} placeholder="請輸入管理密碼" style={{maxWidth:'240px',margin:'0 auto 8px auto',display:'block'}}/>
              <button className="btn btn-o" onClick={handleVerifyAdmin}>解鎖上傳</button>
            </div>
          ):(
            <div style={{background:'rgba(212,175,55,0.05)',border:'1px dashed var(--gold)',borderRadius:'8px',padding:'15px',marginBottom:'15px'}}>
              <div style={{display:'flex',justifyContent:'space-between',marginBottom:'8px'}}><span style={{color:'var(--gold-l)',fontSize:'0.85rem'}}>🎨 畫作上傳區 (直連 GitHub 雲端永久保存)</span><button className="btn btn-o" style={{fontSize:'0.6rem'}} onClick={()=>setAdmin(false)}>登出</button></div>
              <input type="text" value={artName} onChange={(e)=>setArtName(e.target.value)} placeholder="請輸入中文畫名"/>
              <input type="text" value={artWm} onChange={(e)=>setArtWm(e.target.value)} placeholder="浮水印文字"/>
              <input type="file" accept="image/*" onChange={handleFileChange} style={{marginBottom:'8px',color:'var(--text)'}}/>
              <button className="btn" style={{width:'100%',marginTop:'5px'}} onClick={handleUploadArt} disabled={uploading}>
                {uploading ? '正在同步至 GitHub 雲端...' : '確認上架至雲端 (NT$ 680)'}
              </button>
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
                    <button className="btn btn-o" style={{width:'100%',fontSize:'0.7rem'}} onClick={()=>addToCart(item.name,680)}>加入購物車</button>
                    {admin && (
                      <button className="btn" style={{width:'100%',fontSize:'0.7rem',background:'#8b0000',color:'#fff'}} onClick={()=>handleDeleteArt(idx)}>刪除此畫作</button>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        </section>

        <section id="contact" className="notice-box">
          <h4>📞 聯絡方式與預約專線</h4>
          <p><strong>服務老師：</strong>彭品心（紫墨老師）</p>
          <p><strong>預約電話：</strong>0987-955-906</p>
          <p><strong>電子信箱：</strong>Aaa0987955906aaa@gmail.com</p>
          <p><strong>官方臉書粉專：</strong><a href="https://www.facebook.com/pengpinxin/" target="_blank" rel="noopener noreferrer" style={{color:'var(--gold-l)',textDecoration:'underline'}}>https://www.facebook.com/pengpinxin/</a></p>
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

      <div className="drawer" id="cart">
        <div style={{display:'flex',justifyContent:'space-between',marginBottom:'12px',borderBottom:'1px solid var(--border)',paddingBottom:'8px'}}><h3 style={{color:'var(--gold-l)',fontSize:'0.95rem'}}>🛒 購物車與結帳</h3><button onClick={closeCart} style={{background:'none',border:'none',color:'#fff',fontSize:'1.2rem'}}>✕</button></div>
        
        {isVip && (
          <div style={{background:'rgba(212,175,55,0.15)',border:'1px solid var(--gold)',borderRadius:'6px',padding:'8px',marginBottom:'10px',textAlign:'center'}}>
            <span style={{color:'var(--gold-l)',fontSize:'0.8rem',fontWeight:'bold'}}>👑 尊榮 VIP 9折會員已認證</span>
          </div>
        )}

        <div style={{flexGrow:1,overflowY:'auto',marginBottom:'10px'}}>
          {cart.length===0?(<p style={{color:'#d0c5b4',textAlign:'center',padding:'15px'}}>購物車是空的</p>):(
            cart.map((i,idx)=>(<div key={idx} style={{display:'flex',justifyContent:'space-between',padding:'6px 0',borderBottom:'1px solid rgba(74,61,49,0.3)',fontSize:'0.8rem'}}><span>{i.name}</span><span>NT$ {i.price} <button onClick={()=>removeFromCart(idx)} style={{background:'none',border:'none',color:'var(--gold)',cursor:'pointer',marginLeft:'6px'}}>刪除</button></span></div>))
          )}
        </div>
        <div style={{borderTop:'1px solid var(--border)',paddingTop:'10px'}}>
          <div style={{display:'flex',gap:'5px',marginBottom:'8px'}}>
            <input type="text" value={vipCode} onChange={(e)=>setVipCode(e.target.value)} placeholder="VIP碼 (VIP880)" style={{margin:0}}/>
            <button className="btn btn-o" onClick={handleVerifyVipCode}>驗證</button>
          </div>
          <div style={{display:'flex',justifyContent:'space-between',fontSize:'0.9rem',fontWeight:'bold',color:'var(--gold-l)',marginBottom:'10px'}}>
            <span>總計：</span><span>NT$ {total} {vipText}</span>
          </div>
          <input type="text" value={cName} o
