import { NextResponse } from 'next/server';

export async function POST(request) {
  try {
    const body = await request.json();
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

    const messageContent = `【品心美學官網新訂單通知】\n\n訂單編號：${MerchantTradeNo}\n訂單時間：${MerchantTradeDate}\n\n【購買品項】\n${itemName}\n\n【總金額】\nNT$ ${totalAmount}\n\n【客戶聯絡與備註】\n姓名：${customerName}\n電話：${customerPhone}\n信箱：${customerEmail}\n地址：${customerAddress}\n備註需求：${customerRemark}`;

    // 1. 僅發送訂單通知給商家 (透過 Web3Forms 寄回您的綁定信箱，絕不發信給客戶)
    const response = await fetch('https://api.web3forms.com/submit', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        access_key: '23b49742-5311-4475-8468-d053229b1be8',
        subject: `【品心美學新訂單】來自 ${customerName} 的訂單 (${MerchantTradeNo})`,
        name: customerName,
        email: customerEmail,
        message: messageContent
      })
    });

    const result = await response.json();
    if (!result.success) {
      throw new Error(result.message || '郵件發送失敗');
    }

    // 2. 同時發送通知到您的 LINE (若有在 Vercel 設定 LINE_CHANNEL_ACCESS_TOKEN 與 LINE_USER_ID)
    const lineToken = process.env.LINE_CHANNEL_ACCESS_TOKEN;
    const lineUserId = process.env.LINE_USER_ID;

    if (lineToken && lineUserId) {
      try {
        await fetch('https://api.line.me/v2/bot/message/push', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${lineToken}`
          },
          body: JSON.stringify({
            to: lineUserId,
            messages: [{ type: 'text', text: messageContent }]
          })
        });
      } catch (lineErr) {
        console.error('LINE Push error:', lineErr);
      }
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
