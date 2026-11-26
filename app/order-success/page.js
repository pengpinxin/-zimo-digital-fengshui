'use client';
import { useEffect, useState } from 'react';

export default function OrderSuccess() {
  const [orderNo, setOrderNo] = useState('');
  const [orderTotal, setOrderTotal] = useState(0);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const params = new URLSearchParams(window.location.search);
    const no = (params.get('orderno') || '').trim();
    const urlAmount = Number(params.get('amount')) || 0;
    setOrderNo(no);

    let total = urlAmount;
    let itemNames = [];
    let numItems = 0;

    try {
      const savedCart = JSON.parse(localStorage.getItem('z_cart') || '[]');
      if (Array.isArray(savedCart) && savedCart.length > 0) {
        if (!total) {
          total = savedCart.reduce((sum, item) => sum + (Number(item.price) || 0), 0);
        }
        itemNames = savedCart.map((item) => item.name).filter(Boolean);
        numItems = savedCart.length;
      }
      if (no) {
        localStorage.removeItem('z_cart');
      }
    } catch (e) {}

    setOrderTotal(total);

    if (!no) return;

    const firePurchase = () => {
      if (typeof window.fbq !== 'function') return false;
      const payload = {
        value: total,
        currency: 'TWD',
        content_type: 'product',
        num_items: numItems || 1,
      };
      if (itemNames.length > 0) {
        payload.content_name = itemNames.join(', ');
      }
      window.fbq('track', 'Purchase', payload, { eventID: no });
      return true;
    };

    try {
      const trackedKey = `px_purchase_${no}`;
      if (sessionStorage.getItem(trackedKey)) return;
      if (firePurchase()) {
        sessionStorage.setItem(trackedKey, '1');
      }
    } catch (e) {
      firePurchase();
    }
  }, []);

  return (
    <div
      style={{
        minHeight: '100vh',
        background: '#1a1714',
        color: '#f3efe6',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '20px',
        fontFamily: '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,"Noto Sans TC",sans-serif',
      }}
    >
      <div
        style={{
          maxWidth: '460px',
          width: '100%',
          background: '#24201c',
          border: '1px solid #d4af37',
          borderRadius: '10px',
          padding: '28px 22px',
          textAlign: 'center',
          boxShadow: '0 8px 24px rgba(0,0,0,0.45)',
        }}
      >
        <div
          style={{
            width: '48px',
            height: '48px',
            margin: '0 auto 14px',
            borderRadius: '50%',
            border: '1.5px solid #d4af37',
            color: '#f3e5ab',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '1.4rem',
            fontWeight: 'bold',
          }}
        >
          ✓
        </div>
        <h1 style={{ color: '#f3e5ab', fontSize: '1.3rem', marginBottom: '10px', letterSpacing: '1px' }}>
          感謝您的訂購
        </h1>
        <p style={{ fontSize: '0.88rem', color: '#d0c5b4', lineHeight: '1.75', marginBottom: '16px' }}>
          付款已完成，品心美學將盡快為您安排服務或透過 Email 寄送數位原檔。
        </p>

        {orderNo && (
          <div
            style={{
              background: 'rgba(212,175,55,0.08)',
              border: '1px solid #4a3d31',
              borderRadius: '8px',
              padding: '12px',
              marginBottom: '18px',
              fontSize: '0.82rem',
              lineHeight: '1.7',
            }}
          >
            <div style={{ color: '#d4af37', wordBreak: 'break-all' }}>訂單編號：{orderNo}</div>
            {orderTotal > 0 && (
              <div style={{ color: '#f3efe6' }}>訂單金額：NT$ {orderTotal.toLocaleString()}</div>
            )}
          </div>
        )}

        <p style={{ fontSize: '0.78rem', color: '#d0c5b4', marginBottom: '20px', lineHeight: '1.6' }}>
          如有任何疑問，請聯繫官方 LINE：
          <strong style={{ color: '#f3e5ab' }}>0987955906</strong>
        </p>

        <a
          href="/"
          style={{
            display: 'inline-block',
            background: 'linear-gradient(135deg,#d4af37,#b59226)',
            color: '#1a1714',
            padding: '10px 26px',
            borderRadius: '16px',
            fontWeight: 'bold',
            fontSize: '0.85rem',
            textDecoration: 'none',
          }}
        >
          返回品心美學首頁
        </a>
      </div>
    </div>
  );
          }
