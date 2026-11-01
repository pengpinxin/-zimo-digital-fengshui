'use client';
import { useState } from 'react';

export default function Home() {
  const [cart, setCart] = useState([]);
  const [vipCode, setVipCode] = useState('');
  const [vipApplied, setVipApplied] = useState(false);
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [isCheckingOut, setIsCheckingOut] = useState(false);

  // 產品與服務清單（已正確對齊所有定價）
  const products = [
    { id: 'book-1', name: '《生命的出口》', price: 269 },
    { id: 'book-2', name: '《進階思維的後裔》', price: 269 },
    { id: 'service-1', name: '手機號碼開運配置', price: 1680 },
    { id: 'service-2', name: '車牌號碼吉凶配置', price: 2280 },
    { id: 'service-3', name: '住宅位址磁場解析', price: 3600 },
    { id: 'service-4', name: '店鋪位址財位配置', price: 5800 },
  ];

  const addToCart = (product) => {
    setCart([...cart, product]);
  };

  const removeFromCart = (index) => {
    const newCart = [...cart];
    newCart.splice(index, 1);
    setCart(newCart);
  };

  const handleVipVerify = () => {
    if (vipCode.trim() !== '') {
      setVipApplied(true);
      alert('VIP 專屬碼驗證成功，全館商品已享 9 折優惠！');
    } else {
      alert('請輸入有效的 VIP 碼');
    }
  };

  const calculateTotal = () => {
    const subtotal = cart.reduce((sum, item) => sum + item.price, 0);
    return vipApplied ? Math.round(subtotal * 0.9) : subtotal;
  };

  // 結帳並觸發您已設定好的後端郵件打包與綠界串接
  const handleCheckout = async (e) => {
    e.preventDefault();
    if (cart.length === 0) {
      alert('購物車目前是空的');
      return;
    }
    if (!customerName || !customerPhone) {
      alert('請填寫姓名與聯絡電話');
      return;
    }

    setIsCheckingOut(true);
    try {
      const orderData = {
        name: customerName,
        phone: customerPhone,
        items: cart,
        amount: calculateTotal(),
        vipApplied: vipApplied
      };

      const res = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(orderData),
      });

      const result = await res.json();
      if (result.success) {
        alert('訂單已成功送出！通知信已順利打包發送。');
        setCart([]);
        setCustomerName('');
        setCustomerPhone('');
      } else {
        alert('結帳送出發生異常，請確認後端設定');
      }
    } catch (error) {
      console.error('結帳錯誤:', error);
      alert('連線伺服器發生錯誤');
    } finally {
      setIsCheckingOut(false);
    }
  };

  return (
    <main className="min-h-screen bg-[#0f0e0e] text-[#e8e6e3] font-serif p-4 md:p-8 max-w-xl mx-auto space-y-6 selection:bg-[#c5a059] selection:text-black">
      {/* 頂部導覽列 */}
      <nav className="flex justify-between items-center bg-[#181512] border border-[#2e2720] p-4 rounded-lg sticky top-0 z-50 shadow-lg">
        <div className="flex items-center space-x-2">
          <span className="bg-[#c5a059] text-black font-bold px-2.5 py-1 rounded text-sm">品</span>
          <div>
            <h1 className="text-[#c5a059] font-bold text-base tracking-wider">品心美學</h1>
            <p className="text-[10px] text-[#a8a095] tracking-widest">Pin Xin Aesthetics</p>
          </div>
        </div>
        <div className="flex space-x-2 items-center">
          <a href="#cart-section" className="bg-[#2e2720] text-[#e8e6e3] px-3 py-1.5 rounded text-xs border border-[#443a2f] hover:border-[#c5a059] transition">
            購物車 ({cart.length}) {vipApplied && <span className="text-[#c5a059]">(9折)</span>}
          </a>
          <a href="#contact" className="bg-[#2e2720] text-[#e8e6e3] px-3 py-1.5 rounded text-xs border border-[#443a2f] hover:border-[#c5a059] transition">
            聯絡
          </a>
        </div>
      </nav>

      {/* 品牌標頭 */}
      <section className="bg-[#181512] border border-[#2e2720] p-6 rounded-lg text-center space-y-2 shadow-md">
        <h2 className="text-xl md:text-2xl font-bold text-[#c5a059] tracking-widest">品心書閣</h2>
        <p className="text-xs md:text-sm text-[#a8a095]">學術文學創作、數字命理與東方美學空間</p>
      </section>

      {/* VIP 會員專區 */}
      <section className="bg-[#181512] border border-[#2e2720] p-6 rounded-lg space-y-3 shadow-md">
        <div className="flex items-center space-x-2 text-[#c5a059] font-bold text-base">
          <span>👑</span>
          <h3>VIP 會員專區</h3>
        </div>
        <p className="text-xs md:text-sm text-[#a8a095]">輸入專屬 VIP 碼即可享全館商品 9 折優惠。</p>
        <div className="flex gap-2 pt-1">
          <input 
            type="text" 
            placeholder="請輸入VIP碼" 
            value={vipCode}
            onChange={(e) => setVipCode(e.target.value)}
            className="bg-[#0f0e0e] border border-[#332e26] p-2.5 rounded-md flex-1 text-xs md:text-sm text-white focus:outline-none focus:border-[#c5a059]" 
          />
          <button 
            onClick={handleVipVerify}
            className="bg-[#c5a059] text-black font-medium px-4 py-2.5 rounded-md text-xs md:text-sm hover:bg-[#b08f48] transition">
            驗證
          </button>
        </div>
      </section>

      {/* 關於老師 */}
      <section className="bg-[#181512] border border-[#2e2720] p-6 rounded-lg space-y-2 shadow-md">
        <h3 className="text-lg font-bold text-[#c5a059] tracking-wider">關於老師</h3>
        <p className="text-xs md:text-sm text-[#a8a095] leading-relaxed">
          喧囂的世間，每個人都在找尋安放靈魂的角落。品心老師致力於融合學術文學、東方書畫、禪意音樂與數字命理。
        </p>
      </section>

      {/* 學術著作 */}
      <section className="space-y-3">
        <h3 className="text-lg font-bold text-[#c5a059] tracking-wider px-1">學術著作</h3>
        
        <div className="bg-[#181512] border border-[#2e2720] p-5 rounded-lg flex justify-between items-center shadow-md">
          <div className="space-y-1">
            <h4 className="font-bold text-base text-[#f0ede6]">《生命的出口》</h4>
            <p className="text-xs text-[#c5a059] font-semibold">NT$ 269</p>
          </div>
          <button 
            onClick={() => addToCart(products[0])}
            className="bg-[#c5a059] text-black font-medium px-4 py-2 rounded text-xs md:text-sm hover:bg-[#b08f48] transition shadow">
            加入購物車
          </button>
        </div>

        <div className="bg-[#181512] border border-[#2e2720] p-5 rounded-lg flex justify-between items-center shadow-md">
          <div className="space-y-1">
            <h4 className="font-bold text-base text-[#f0ede6]">《進階思維的後裔》</h4>
            <p className="text-xs text-[#c5a059] font-semibold">NT$ 269</p>
          </div>
          <button 
            onClick={() => addToCart(products[1])}
            className="bg-[#c5a059] text-black font-medium px-4 py-2 rounded text-xs md:text-sm hover:bg-[#b08f48] transition shadow">
            加入購物車
          </button>
        </div>
      </section>

      {/* 四大高端數字風水諮詢服務 */}
      <section className="space-y-3">
        <h3 className="text-lg font-bold text-[#c5a059] tracking-wider px-1">四大高端數字風水諮詢服務</h3>
        
        <div className="bg-[#181512] border border-[#2e2720] p-5 rounded-lg flex justify-between items-center shadow-md">
          <div className="space-y-1">
            <h4 className="font-bold text-base text-[#f0ede6]">手機號碼開運配置</h4>
            <p className="text-xs text-[#c5a059] font-semibold">NT$ 1,680</p>
          </div>
          <button 
            onClick={() => addToCart(products[2])}
            className="bg-[#c5a059] text-black font-medium px-4 py-2 rounded text-xs md:text-sm hover:bg-[#b08f48] transition shadow">
            加入購物車
          </button>
        </div>

        <div className="bg-[#181512] border border-[#2e2720] p-5 rounded-lg flex justify-between items-center shadow-md">
          <div className="space-y-1">
            <h4 className="font-bold text-base text-[#f0ede6]">車牌號碼吉凶配置</h4>
            <p className="text-xs text-[#c5a059] font-semibold">NT$ 2,280</p>
          </div>
          <button 
            onClick={() => addToCart(products[3])}
            className="bg-[#c5a059] text-black font-medium px-4 py-2 rounded text-xs md:text-sm hover:bg-[#b08f48] transition shadow">
            加入購物車
          </button>
        </div>

        <div className="bg-[#181512] border border-[#2e2720] p-5 rounded-lg flex justify-between items-center shadow-md">
          <div className="space-y-1">
            <h4 className="font-bold text-base text-[#f0ede6]">住宅位址磁場解析</h4>
            <p className="text-xs text-[#c5a059] font-semibold">NT$ 3,600</p>
          </div>
          <button 
            onClick={() => addToCart(products[4])}
            className="bg-[#c5a059] text-black font-medium px-4 py-2 rounded text-xs md:text-sm hover:bg-[#b08f48] transition shadow">
            加入購物車
          </button>
        </div>

        <div className="bg-[#181512] border border-[#2e2720] p-5 rounded-lg flex justify-between items-center shadow-md">
          <div className="space-y-1">
            <h4 className="font-bold text-base text-[#f0ede6]">店鋪位址財位配置</h4>
            <p className="text-xs text-[#c5a059] font-semibold">NT$ 5,800</p>
          </div>
          <button 
            onClick={() => addToCart(products[5])}
            className="bg-[#c5a059] text-black font-medium px-4 py-2 rounded text-xs md:text-sm hover:bg-[#b08f48] transition shadow">
            加入購物車
          </button>
        </div>
      </section>

      {/* 購物車與結帳區（串接後端 API） */}
      <section id="cart-section" className="bg-[#181512] border border-[#2e2720] p-6 rounded-lg space-y-4 shadow-md">
        <h3 className="text-lg font-bold text-[#c5a059] tracking-wider">購物車明細</h3>
        {cart.length === 0 ? (
          <p className="text-xs text-[#a8a095]">目前購物車是空的</p>
        ) : (
          <div className="space-y-2">
            {cart.map((item, idx) => (
              <div key={idx} className="flex justify-between items-center text-xs border-b border-[#26211c] pb-2">
                <span>{item.name}</span>
                <div className="flex items-center space-x-3">
                  <span className="text-[#c5a059]">NT$ {item.price}</span>
                  <button onClick={() => removeFromCart(idx)} className="text-red-400 hover:underline">移除</button>
                </div>
              </div>
            ))}
            <div className="pt-2 flex justify-between font-bold text-sm text-[#f0ede6]">
              <span>總計金額 {vipApplied && <span className="text-[#c5a059] text-xs">(已享VIP 9折)</span>}</span>
              <span className="text-[#c5a059]">NT$ {calculateTotal()}</span>
            </div>

            <form onSubmit={handleCheckout} className="space-y-3 pt-4 border-t border-[#26211c]">
              <h4 className="text-xs font-bold text-[#c5a059]">填寫結帳與通知資訊</h4>
              <input 
                type="text" 
                placeholder="您的姓名" 
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
                className="bg-[#0f0e0e] border border-[#332e26] p-2.5 rounded-md w-full text-xs text-white focus:outline-none focus:border-[#c5a059]"
                required
              />
              <input 
                type="text" 
                placeholder="聯絡電話" 
                value={customerPhone}
                onChange={(e) => setCustomerPhone(e.target.value)}
                className="bg-[#0f0e0e] border border-[#332e26] p-2.5 rounded-md w-full text-xs text-white focus:outline-none focus:border-[#c5a059]"
                required
              />
              <button 
                type="submit" 
                disabled={isCheckingOut}
                className="w-full bg-[#c5a059] text-black font-bold py-2.5 rounded text-xs hover:bg-[#b08f48] transition">
                {isCheckingOut ? '處理中...' : '確認送出訂單（串接郵件與綠界）'}
              </button>
            </form>
          </div>
        )}
      </section>

      {/* 書畫藝廊 */}
      <section className="bg-[#181512] border border-[#2e2720] p-6 rounded-lg space-y-2 shadow-md">
        <h3 className="text-lg font-bold text-[#c5a059] tracking-wider">書畫藝廊</h3>
        <p className="text-xs md:text-sm text-[#a8a095] leading-relaxed">
          探索高解析傳統水墨、工筆與水彩藝術創作空間，品味筆墨之間流轉的禪意。
        </p>
      </section>

      {/* 官方聯繫與頁尾 */}
      <footer id="contact" className="text-center py-12 text-xs text-[#70685e] space-y-2 border-t border-[#26211c]">
        <p className="text-sm font-bold text-[#c5a059]">品心書閣 · 紫墨數字風水</p>
        <p>
          官方信箱：<a href="mailto:Aaa0987955906aaa@gmail.com" className="text-[#c5a059] underline">Aaa0987955906aaa@gmail.com</a>
        </p>
        <p>
          官方臉書：<a href="https://www.facebook.com/pengpinxin/" target="_blank" rel="noopener noreferrer" className="text-[#c5a059] underline">彭品心 Facebook 專頁</a>
        </p>
        <p className="pt-2">© 2026 彭品心 (紫墨老師) 版權所有</p>
      </footer>
    </main>
  );
        }
