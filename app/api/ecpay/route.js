import { NextResponse } from 'next/server';

export async function POST(request) {
  try {
    let body = {};
    try {
      body = await request.json();
    } catch (e) {}

    const { totalAmount, itemName, customerName, customerPhone, customerEmail, customerAddress, customerRemark } = body;

    const MerchantTradeNo = 'T' + Date.now();
    const MerchantTradeDate = new Date().toLocaleString('zh-TW', {
      timeZone: 'Asia/Taipei',
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: false
    }).replace(/\//g, '').replace(',', '').replace(/\s/, ' ');

    const messageContent = `【品心美學官網新訂單通知】\n\n訂單編號：${MerchantTradeNo}\n訂單時間：${MerchantTradeDate}\n\n【購買品項】\n${itemName || '無'}\n\n【總金額】\nNT$ ${totalAmount || 0}\n\n【客戶聯絡與備註】\n姓名：${customerName || ''}\n電話：${customerPhone || ''}\n信箱：${customerEmail || ''}\n地址：${customerAddress || ''}\n備註需求：${customerRemark || ''}`;

    try {
      await fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          access_key: '23b49742-5311-4475-8468-d053229b1be8',
          subject: `【品心美學新訂單】來自 ${customerName || '緣主'} 的訂單 (${MerchantTradeNo})`,
          name: customerName || '緣主',
          email: customerEmail || 'Aaa0987955906aaa@gmail.com',
          message: messageContent
        })
      });
    } catch (mailErr) {
      console.error('Mail error:', mailErr);
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message || '伺服器發生錯誤' }, { status: 200 });
  }
}
