import { NextResponse } from 'next/server';

export async function POST(request) {
  try {
    const body = await request.json();
    const { totalAmount, itemName, customerName, customerPhone, customerEmail, customerAddress, customerRemark, tradeNo, tradeDate } = body;

    const messageContent = 
      `【品心美學官網新訂單通知】\n\n` +
      `訂單編號：${tradeNo}\n` +
      `訂單時間：${tradeDate}\n\n` +
      `【購買品項】\n${itemName}\n\n` +
      `【總金額】\nNT$ ${totalAmount}\n\n` +
      `【客戶聯絡與備註】\n` +
      `姓名：${customerName}\n` +
      `電話：${customerPhone}\n` +
      `信箱：${customerEmail}\n` +
      `地址：${customerAddress}\n` +
      `備註需求：${customerRemark}`;

    // 發送 LINE 推播通知
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
      } catch (lineError) {
        console.error('LINE 推送失敗:', lineError);
      }
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('訂單 API 執行錯誤:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 200 });
  }
}
