'use client';
import {useState, useEffect} from 'react';
export default function Home(){
  const [cart,setCart]=useState([]);
  const [isVip,setIsVip]=useState(false);
  const [artworksList,setArtworksList]=useState([]);
  const [uploading,setUploading]=useState(false);
  const [isAdmin,setIsAdmin]=useState(false);
  useEffect(()=>{
    const sc=localStorage.getItem('zimo_cart');if(sc)setCart(JSON.parse(sc));
    const sa=localStorage.getItem('zimo_artworks');if(sa){try{setArtworksList(JSON.parse(sa));}catch(e){setArtworksList([]);}}
  },[]);
  useEffect(()=>{localStorage.setItem('zimo_cart',JSON.stringify(cart));},[cart]);
  const add=(name,price)=>{setCart([...cart,{name,price}]);alert(`已將「${name}」加入購物車！`);};
  const rm=(idx)=>setCart(cart.filter((_,i)=>i!==idx));
  const applyVip=()=>{if(document.getElementById('vCode').value.trim()==='VIP880'){setIsVip(true);alert('VIP880 驗證成功！享9折');}else{alert('優惠碼錯誤');}};
  const verifyAdmin=()=>{if(document.getElementById('adminPwd').value.trim()==='08241977'){setIsAdmin(true);alert('管理員驗證成功！');}else{alert('密碼錯誤');}};
  const uploadArt=async()=>{
    const nInput=document.getElementById('aName');
    let name=nInput?.value.trim();
    if(!name) name='品心禪意原創畫作';
    const w=document.getElementById('aWm')?.value.trim()||'品心美學 · 彭品心原創';
    const f=document.getElementById('aFile')?.files[0];
    if(!f){alert('請選擇要上傳的畫作圖片！');return;}
    setUploading(true);
    const r=new FileReader();r.readAsDataURL(f);
    r.onload=()=>{
      const img=new Image();
      img.onload=()=>{
        const size=`${img.width} × ${img.height} px`;
        const updated=[{name,price:680,wm:w,size,img:r.result},...artworksList];
        setArtworksList(updated);localStorage.setItem('zimo_artworks',JSON.stringify(updated));
        if(nInput) nInput.value='';
        setUploading(false);
        alert(`上架成功！尺寸 ${size}`);
      };
      img.src=r.result;
    };
  };
  const removeArtwork=(idx)=>{
    if(confirm('確定要刪除這幅畫作嗎？')){
      const updated=artworksList.filter((_,i)=>i!==idx);
      setArtworksList(updated);
      localStorage.setItem('zimo_artworks',JSON.stringify(updated));
    }
  };
  const checkout=()=>{
    const name=document.getElementById('cName').value.trim();
    const phone=document.getElementById('cPhone').value.trim();
    const email=document.getElementById('cEmail').value.trim();
    const address=document.getElementById('cAddress').value.trim();
    if(!name||!phone||!email||!address){alert('請完整填寫姓名、電話、Email 與收件地址！');return;}
    if(cart.length===0){alert('購物車是空的！');return;}
    alert(`感謝 ${name} 緣主！訂單已送出。\n收件地址：${address}`);
    setCart([]);setIsVip(false);
  };
  let total=cart.reduce((s,i)=>s+i.price,0);if(isVip)total=Math.round(total*0.9);
  return(
    <>
      <style jsx global>{`
        :root{--bg:#1a1714;--card:#24201c;--border:#4a3d31;--text:#f3efe6;--muted:#d0c5b4;--gold:#d4af37;--gold-l:#f3e5ab;--gold-d:#aa8c2c;}
        *{box-sizing:border-box;margin:0;padding:0;font-family:sans-serif;}
        body{background:var(--bg);color:var(--text);line-height:1.8;padding-bottom:80px;}
        header{background:rgba(26,23,20,0.95);border-bottom:1px solid var(--border);padding:12px 15px;position:sticky;top:0;z-index:1000;display:flex;justify-content:space-between;align-items:center;}
        .brand{display:flex;align-items:center;gap:10px;}
        .logo{width:38px;height:38px;border:1px solid var(--gold);border-radius:50%;display:flex;align-items:center;justify-content:center;color:var(--gold);font-weight:bold;background:rgba(212,175,55,0.1);flex-shrink:0;}
        .b-text h1{font-size:0.95rem;color:var(--gold-l);white-space:nowrap;}
        .b-text p{font-size:0.68rem;color:var(--muted);white-space:nowrap;}
        .h-act{display:flex;gap:6px;}
        .btn{background:linear-gradient(135deg,var(--gold),var(--gold-d));color:#1a1714;border:none;padding:6px 10px;border-radius:16px;font-size:0.75rem;font-weight:bold;cursor:pointer;white-space:nowrap;}
        .btn-o{background:transparent;border:1px solid var(--gold);color:var(--gold-l);}
        .wrap{max-width:800px;margin:0 auto;padding:20px;}
        .banner{width:100%;border-radius:8px;overflow:hidden;border:1px solid var(--border);margin-bottom:20px;}
        .banner img{width:100%;display:block;}
        .vip-box{background:rgba(212,175,55,0.08);border:1px solid var(--gold);border-radius:10px;padding:20px;margin-bottom:25px;text-align:center;}
        .vip-box h3{color:var(--gold-l);font-size:1.15rem;margin-bottom:8px;}
        .vip-box p{color:var(--muted);font-size:0.85rem;margin-bottom:12px;}
        .intro-section{background:var(--card);border:1px solid var(--border);border-radius:12px;padding:30px 20px;margin-bottom:30px;}
        .intro-title{text-align:center;font-size:1.8rem;color:var(--gold-l);margin-bottom:10px;letter-spacing:3px;}
        .intro-subtitle{text-align:center;font-size:1.05rem;color:var(--gold-l);margin-bottom:20px;line-height:1.8;}
        .intro-content p{margin-bottom:20px;color:var(--muted);text-align:justify;font-size:0.98rem;}
        .sec-title{font-size:1.4rem;color:var(--gold-l);border-left:4px solid var(--gold);padding-left:12px;margin:35px 0 20px 0;}
        .card{background:var(--card);border:1px solid var(--border);border-radius:10px;padding:20px;margin-bottom:20px;display:flex;gap:20px;align-items:center;}
        .card img{width:180px;aspect-ratio:16/9;object-fit:cover;border-radius:6px;border:1px solid var(--border);flex-shrink:0;}
        .grid-2{display:grid;grid-template-columns:repeat(2,1fr);gap:15px;margin-bottom:25px;}
        .s-card{background:var(--card);border:1px solid var(--border);border-radius:10px;padding:18px;display:flex;flex-direction:column;justify-content:space-between;}
        .price{color:var(--gold);font-weight:bold;margin-bottom:6px;}
        .service-note-box{background:rgba(212,175,55,0.06);border:1px solid var(--border);border-radius:10px;padding:20px;margin-top:20px;margin-bottom:25px;color:var(--muted);font-size:0.9rem;text-align:justify;}
        .service-note-box h4{color:var(--gold-l);font-size:1.05rem;margin-bottom:10px;}
        .service-note-box p{margin-bottom:10px;}
        .art-desc-box{background:var(--card);border:1px solid var(--border);border-radius:10px;padding:20px;margin-bottom:20px;color:var(--muted);font-size:0.9rem;text-align:justify;}
        .art-desc-box h4{color:var(--gold-l);font-size:1.1rem;margin-bottom:10px;text-align:center;}
        .art-desc-box p{margin-bottom:10px;}
        .art-size-info{font-size:0.78rem;color:var(--gold-l);margin-bottom:10px;background:rgba(212,175,55,0.06);padding:4px 8px;border-radius:4px;border:1px dashed var(--border);}
        .c-card{background:var(--card);border:1px solid var(--border);border-radius:8px;padding:15px;}
        .c-link{display:inline-block;background:rgba(212,175,55,0.1);border:1px solid var(--gold);color:var(--gold-l);padding:5px 10px;border-radius:15px;font-size:0.72rem;text-decoration:none;}
        .up-panel{background:rgba(212,175,55,0.05);border:1px dashed var(--gold);border-radius:10px;padding:20px;margin-bottom:25px;}
        .up-panel input{width:100%;padding:10px;margin-bottom:10px;border-radius:5px;border:1px solid var(--border);background:#1a1714;color:var(--text);}
        .drawer{position:fixed;top:0;right:-100%;width:100%;max-width:360px;height:100%;background:var(--card);border-left:1px solid var(--border);z-index:2000;padding:20px;transition:0.3s;display:flex;flex-direction:column;}
        .drawer.open{right:0;}
        .d-head{display:flex;justify-content:space-between;align-items:center;border-bottom:1px solid var(--border);padding-bottom:15px;margin-bottom:20px;}
        .d-items{flex-grow:1;overflow-y:auto;margin-bottom:15px;}
        .d-item{display:flex;justify-content:space-between;padding:10px 0;border-bottom:1px solid rgba(74,61,49,0.4);font-size:0.88rem;}
        .cf input,.cf textarea{width:100%;padding:8px;margin-bottom:10px;background:#1a1714;border:1px solid var(--border);color:var(--text);border-radius:4px;}
        footer{background:#151311;border:1px dashed var(--border);border-radius:8px;padding:20px;margin-top:40px;font-size:0.78rem;color:#9c9182;}
        @media(max-width:480px){.card{flex-direction:column;text-align:center;}.card img{width:100%;}}
      `}</style>
      <header>
        <div className="brand"><div className="logo">品</div><div className="b-text"><h1>品心美學</h1><p>學術文學創作 彭品心老師</p></div></div>
        <div className="h-act">
          <button className="btn" onClick={()=>document.getElementById('cartDrawer').classList.add('open')}>🛒 購物車({cart.length})</button>
          <button className="btn btn-o" onClick={()=>document.getElementById('menuDrawer').classList.add('open')}>☰ 選單</button>
        </div>
      </header>
      <div className="drawer" id="menuDrawer">
        <div className="d-head"><h3 style={{color:'var(--gold-l)'}}>📌 網站導覽</h3><button onClick={()=>document.getElementById('menuDrawer').classList.remove('open')} style={{background:'none',border:'none',color:'var(--text)',fontSize:'1.2rem',cursor:'pointer'}}>✕</button></div>
        <div style={{display:'flex',flexDirection:'column',gap:'15px'}}>
          <a href="#vip" onClick={()=>document.getElementById('menuDrawer').classList.remove('open')} style={{color:'var(--gold-l)',textDecoration:'none'}}>💎 VIP 880 終身會員專區</a>
          <a href="#intro" onClick={()=>document.getElementById('menuDrawer').classList.remove('open')} style={{color:'var(--gold-l)',textDecoration:'none'}}>🌟 靈魂的棲息之處</a>
          <a href="#books" onClick={()=>document.getElementById('menuDrawer').classList.remove('open')} style={{color:'var(--gold-l)',textDecoration:'none'}}>📚 學術文學著作專區</a>
          <a href="#services" onClick={()=>document.getElementById('menuDrawer').classList.remove('open')} style={{color:'var(--gold-l)',textDecoration:'none'}}>🔮 紫墨數字風水服務</a>
          <a href="#art" onClick={()=>document.getElementById('menuDrawer').classList.remove('open')} style={{color:'var(--gold-l)',textDecoration:'none'}}>🎨 原創藝術畫作珍藏專區</a>
          <a href="#legalFooter" onClick={()=>document.getElementById('menuDrawer').classList.remove('open')} style={{color:'var(--gold-l)',textDecoration:'none'}}>⚖️ 智慧財產與服務免責聲明</a>
        </div>
      </div>
      <div className="wrap">
        <div className="banner"><img src="/1792354723564.png" alt="banner"/></div>
        <div className="vip-box" id="vip">
          <h3>✨ VIP 880 會員專屬福利</h3>
          <p>享有全館著作、數字配置與原創畫作<strong>終身九折</strong>禮遇！</p>
          <button className="btn" style={{maxWidth:'220px',margin:'0 auto',display:'block'}} onClick={()=>add('VIP 880 終身會員方案',880)}>加入 VIP 880 方案 (NT$ 880)</button>
        </div>
        <section className="intro-section" id="intro">
          <h2 className="intro-title">靈魂的棲息之處</h2>
          <p className="intro-subtitle">喧囂的世間，每個人都在找尋安放靈魂的角落，這裡是開運、療愈、藝術與和諧於一體的心靈家園，品心&紫墨老師歡迎您的到來！</p>
          <div className="intro-content"><p>老師十歲繼承家祖爺爺精準測字絕學，傾於一生對數字、文學、玄學、及各學術類的興趣，藏拙於一身靈性與道行，歷經幾十載世俗的考驗，她清雅脫俗地出落在紅塵萬里天地之間，悉心等待著為值得的人送去福音，將她畢生的學術研究成果，盡心耕織於人類與環境實際需求，廣結善緣、讓福音傳遍千里之外，讓靈慧助人於無形之中。</p></div>
        </section>
        <section id="books">
          <h3 className="sec-title">學術文學著作</h3>
          <div className="card"><img src="/1792440195898.jpg" alt="生命的出口"/><div><h3>生命的出口</h3><div className="price">NT$ 269</div><p>深刻探討心靈轉折與生命出口的經典力作。</p><button className="btn btn-o" onClick={()=>add('生命的出口',269)}>加入購物車</button></div></div>
          <div className="card"><img src="/1792450518058.jpg" alt="進階思維的後裔"/><div><h3>進階思維的後裔</h3><div className="price">NT$ 269</div><p>突破傳統框架，開啟高維度思維模式與人生格局。</p><button className="btn btn-o" onClick={()=>add('進階思維的後裔',269)}>加入購物車</button></div></div>
        </section>
        <section id="services">
          <h3 className="sec-title">紫墨數字風水</h3>
          <div className="grid-2">
            <div className="s-card"><div><h4>手機號碼配置</h4><div className="price">NT$ 1,680</div><p>選定生旺手機吉號。</p></div><button className="btn btn-o" onClick={()=>add('手機號碼配置',1680)}>加入購物車</button></div>
            <div className="s-card"><div><h4>車牌號碼配置</h4><div className="price">NT$ 1,880</div><p>行車平安、磁場加持。</p></div><button className="btn btn-o" onClick={()=>add('車牌號碼配置',1880)}>加入購物車</button></div>
            <div className="s-card"><div><h4>住址門牌選吉</h4><div className="price">NT$ 3,680</div><p>住宅環境風水選吉。</p></div><button className="btn btn-o" onClick={()=>add('住址門牌選吉',3680)}>加入購物車</button></div>
            <div className="s-card"><div><h4>店鋪門牌選吉</h4><div className="price">NT$ 5,680</div><p>商舖聚財、客源廣進。</p></div><button className="btn btn-o" onClick={()=>add('店鋪門牌選吉',5680)}>加入購物車</button></div>
          </div>
          <div className="service-note-box">
            <h4>📌 購買服務注意事項與流程說明：</h4>
            <p><strong>1. 預約流程：</strong>手機、車牌、店鋪、住址配置高端生旺風水號碼，須請您先自行向相關單位申請或初步選定您喜歡的 3～5 組號碼，再透過預約表單告訴紫墨老師，老師將為您進行人工深度解析與最終吉凶配置！</p>
            <p><strong>2. 專業鑑定聲明：</strong>經過老師數字分析之後，如若您的原生號碼本身就是生旺您的吉數，那麼便是最好的數字配置，則不需要更換；然而，老師則同樣會收取您的鑑定費用。因為這是消耗老師大量精力的專業性諮詢服務，還請緣主務必尊重學術文學的強大驅動力。</p>
          </div>
        </section>
        <div style={{display:'grid',gridTemplateColumns:'repeat(2, 1fr)',gap:'15px',margin:'30px 0'}}>
          <div className="c-card"><h5 style={{color:'var(--gold-l)',marginBottom:'8px'}}>📞 服務專線</h5><p style={{fontSize:'0.85rem'}}>0987-955-906</p></div>
          <div className="c-card"><h5 style={{color:'var(--gold-l)',marginBottom:'8px'}}>電子郵箱</h5><a href="mailto:Aaa0987955906aaa@gmail.com" className="c-link">Aaa0987955906aaa@gmail.com</a></div>
          <div className="c-card"><h5 style={{color:'var(--gold-l)',marginBottom:'8px'}}>官方 LINE</h5><a href="https://line.me/ti/p/~0987955906" target="_blank" rel="noreferrer" className="c-link">點擊加入 LINE</a></div>
          <div className="c-card"><h5 style={{color:'var(--gold-l)',marginBottom:'8px'}}>FB 官方粉專</h5><a href="https://www.facebook.com/pengpinxin/" target="_blank" rel="noreferrer" className="c-link">造訪粉絲專頁</a></div>
        </div>
        <section id="art">
          <h3 className="sec-title">原創藝術畫作珍藏專區 (NT$ 680)</h3>
          <div className="art-desc-box"><h4>🎨 品心美學 · 老師精心精選原創藝術流傳與結緣</h4><p>每一幅畫作均為彭品心老師傾注心力、經過嚴格精挑細選的藝術結晶，均一價 NT$ 680，採純原創作品售出（不含裝裱），藏家可自行挑選裝裱方式。此專區支援無限量上傳與加長。</p></div>
          {!isAdmin?(
            <div className="up-panel" style={{textAlign:'center'}}>
              <h4 style={{color:'var(--gold-l)',marginBottom:'10px'}}>🔒 老師專用畫作上傳管理</h4>
              <input type="password" id="adminPwd" placeholder="請輸入管理密碼" style={{maxWidth:'280px',margin:'0 auto 10px auto',display:'block'}}/>
              <button className="btn btn-o" style={{maxWidth:'200px',margin:'0 auto',display:'block'}} onClick={verifyAdmin}>解鎖上傳功能</button>
            </div>
          ):(
            <div className="up-panel">
              <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:'10px'}}><h4 style={{color:'var(--gold-l)'}}>🎨 老師專用上傳區</h4><button className="btn btn-o" style={{fontSize:'0.65rem',padding:'3px 8px'}} onClick={()=>setIsAdmin(false)}>鎖定登出</button></div>
              <p style={{fontSize:'0.8rem',color:'var(--gold-l)',marginBottom:'8px'}}>💡 請輸入中文畫名（未填寫將自動帶入優美預設名稱），再選擇手機圖片上架：</p>
              <input type="text" id="aName" placeholder="請輸入畫作中文名稱（例如：觀音顯化、幽谷清泉）"/>
              <input type="text" id="aWm" defaultValue="品心美學 · 彭品心原創" placeholder="浮水印文字"/>
              <input type="file" id="aFile" accept="image/*" onChange={(e)=>{
                const f=e.target.files[0];
                if(f){
                  const nInput=document.getElementById('aName');
                  if(nInput && !nInput.value){
                    let fname=f.name.substring(0,f.name.lastIndexOf('.'))||f.name;
                    if(/^\d+$/.test(fname)){fname='品心禪意原創畫作';}
                    nInput.value=fname;
                  }
                }
              }}/>
              <button className="btn" style={{width:'100%'}} onClick={uploadArt} disabled={uploading}>{uploading?'處理中...':'確認上傳並自動標示尺寸上架 (NT$ 680)'}</button>
            </div>
          )}
          <div className="grid-2" id="artGallery">
            {artworksList.length===0?(
              <p style={{color:'var(--muted)',gridColumn:'span 2',textAlign:'center',padding:'20px'}}>目前尚無上傳畫作</p>
            ):(
              artworksList.map((a,idx)=>(
                <div className="s-card" key={idx}>
                  <div>
                    <div style={{position:'relative'}}>
                      <img src={a.img} style={{width:'100%',height:'140px',objectFit:'cover',borderRadius:'6px',border:'1px solid var(--border)'}} alt={a.name}/>
                      <div style={{position:'absolute',bottom:'8px',right:'8px',fontSize:'0.65rem',background:'rgba(0,0,0,0.7)',color:'#fff',padding:'2px 5px',borderRadius:'3px'}}>{a.wm}</div>
                    </div>
                    <h4 style={{color:'var(--gold-l)',marginTop:'8px'}}>{a.name}</h4>
                    <div className="art-size-info">📏 原始尺寸：{a.size}</div>
                    <div className="price">NT$ {a.price}</div>
                  </div>
                  <div>
                    <button className="btn btn-o" style={{width:'100%',marginTop:'8px'}} onClick={()=>add(a.name,680)}>加入購物車</button>
                    {isAdmin && (
                      <button className="btn" style={{width:'100%',marginTop:'6px',background:'#8b0000',color:'#fff'}} onClick={()=>removeArtwork(idx)}>刪除此畫作</button>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        </section>
        <footer id="legalFooter">
          <h5 style={{color:'var(--gold-l)',marginBottom:'8px'}}>【智慧財產與服務免責聲明】</h5>
          <p>本網站所載之所有學術文學著作、原創美學畫作、數字風水配置及門牌選吉內容，均受智慧財產權與著作權法保護，未經授權切勿任意轉載。</p>
          <p style={{marginTop:'15px',textAlign:'center',color:'var(--gold)'}}>© 品心美學 ｜ 學術文學創作 彭品心老師 官方網站</p>
        </footer>
      </div>
      <div className="drawer" id="cartDrawer">
        <div className="d-head"><h3 style={{color:'var(--gold-l)'}}>🛒 您的專屬購物車與結帳單</h3><button onClick={()=>document.getElementById('cartDrawer').classList.remove('open')} style={{background:'none',border:'none',color:'var(--text)',fontSize:'1.2rem',cursor:'pointer'}}>✕</button></div>
        <div className="d-items" id="cList">
          {cart.length===0?(<p style={{color:'var(--muted)',textAlign:'center',padding:'20px 0'}}>購物車是空的</p>):(
            cart.map((i,idx)=>(<div className="d-item" key={idx}><span>{i.name}</span><span>NT$ {i.price} <button onClick={()=>rm(idx)} style={{color:'var(--gold)',background:'none',border:'none',cursor:'pointer',marginLeft:'10px'}}>刪除</button></span></div>))
          )}
        </div>
        <div style={{borderTop:'1px solid var(--border)',paddingTop:'15px',marginTop:'auto'}}>
          <div style={{marginBottom:'10px'}}>
            <div style={{display:'flex',gap:'6px',marginBottom:'6px'}}>
              <input type="text" id="vCode" placeholder="輸入 VIP 優惠碼 (VIP880)" style={{flex:1,padding:'8px',background:'#1a1714',border:'1px solid var(--border)',color:'var(--text)',borderRadius:'4px'}} />
              <button className="btn btn-o" style={{padding:'6px 10px',fontSize:'0.75rem'}} onClick={applyVip}>驗證</button>
            </div>
            <button className="btn btn-o" style={{width:'100%',padding:'6px',fontSize:'0.78rem'}} onClick={()=>add('VIP 880 終身會員方案',880)}>✨ 點此直接加入 VIP 880 終身會員 (享全館9折)</button>
          </div>
          <div style={{display:'flex',justifyContent:'space-between',fontSize:'1.05rem',fontWeight:'bold',color:'var(--gold-l)',marginBottom:'15px'}}><span>總計金額：</span><span>NT$ {total} {isVip&&<span style={{fontSize:'0.8rem',color:'var(--gold)'}}>(已享9折)</span>}</span></div>
          <div className="cf">
            <input type="text" id="cName" placeholder="請輸入您的姓名"/>
            <input type="text" id="cPhone" placeholder="請輸入您的電話"/>
            <input type="email" id="cEmail" placeholder="請輸入您的 Email"/>
            <input type="text" id="cAddress" placeholder
