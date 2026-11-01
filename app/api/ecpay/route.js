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

    const orderDetailsText = `【品心美學官網新訂單】\n\n訂單編號：${MerchantTradeNo}\n訂單時間：${MerchantTradeDate}\n\n【購買品項】\n${itemName}\n\n【總金額】\nNT$ ${totalAmount}\n\n【客戶聯絡與備註】\n姓名：${customerName}\n電話：${customerPhone}\n信箱：${customerEmail}\n地址：${customerAddress}\n備註需求：${customerRemark}`;

    // 1. 發送詳細訂單通知給商家信箱 (Aaa0987955906aaa@gmail.com)
    try {
      await fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          access_key: '23b49742-5311-4475-8468-d053229b1be8',
          subject: `【品心美學新訂單】來自 ${customerName || '緣主'} 的訂單 (${MerchantTradeNo})`,
          from_name: '品心美學官網訂單系統',
          to: 'Aaa0987955906aaa@gmail.com',
          message: orderDetailsText
        })
      });
    } catch (mailErr) {
      console.error('Merchant Email send error:', mailErr);
    }

    // 2. 同時發送通知到您的 LINE (透過 LINE Messaging API Push Message)
    // 須在 Vercel 專案設定中加入 LINE_CHANNEL_ACCESS_TOKEN 與 LINE_USER_ID
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
            messages: [
              {
                type: 'text',
                text: orderDetailsText
              }
            ]
          })
        });
      } catch (lineErr) {
        console.error('LINE Push error:', lineErr);
      }
    }

    // 3. 發送溫馨確認信給客人
    if (customerEmail) {
      try {
        await fetch('https://api.web3forms.com/submit', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            access_key: '23b49742-5311-4475-8468-d053229b1be8',
            subject: `【品心美學】訂單確認與溫馨通知`,
            from_name: '品心美學',
            to: customerEmail,
            message: `尊敬的 ${customerName || '緣主'} 您好：\n\n謝謝您的喜歡，商家已收到您的訂單通知，請您悉心等候商家寄出商品或回复！\n\n【您的訂單明細】\n訂單編號：${MerchantTradeNo}\n購買品項：${itemName}\n總金額：NT$ ${totalAmount}\n\n如您有其它相關問題，請您添加品心美學官方LINE說明詳細信息，祝您生活順心愉快，謝謝您💕\n\n品心美學 敬上`
          })
        });
      } catch (clientMailErr) {
        console.error('Client Email send error:', clientMailErr);
      }
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
