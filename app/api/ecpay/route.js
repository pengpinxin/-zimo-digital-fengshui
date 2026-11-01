import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

export async function POST(request) {
  try {
    const body = await request.json();
    const { totalAmount, itemName, customerName, customerPhone, customerEmail, customerAddress, customerRemark, tradeNo, tradeDate } = body;

    const emailSubject = `【品心美學新訂單】來自 ${customerName} (${tradeNo})`;
    const emailBody = 
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

    // 1. 發送 Email 通知至老師信箱（獨立捕捉錯誤，不影響前端與後端主流程）
    try {
      const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
          user: process.env.EMAIL_USER || 'Aaa0987955906aaa@gmail.com',
          pass: process.env.EMAIL_PASS
        }
      });

      await transporter.sendMail({
        from: '"品心美學官網" <Aaa0987955906aaa@gmail.com>',
        to: 'Aaa0987955906aaa@gmail.com',
        subject: emailSubject,
        text: emailBody
      });
    } catch (emailError) {
      console.error('郵件發送失敗:', emailError);
    }

    // 2. 發送 LINE 推播通知（獨立捕捉錯誤，確保穩定）
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
            messages: [{ type: 'text', text: emailBody }]
          })
        });
      } catch (lineError) {
        console.error('LINE 推送失敗:', lineError);
      }
    }

    // 3. 確保前端順利接收成功回應
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('訂單 API 執行錯誤:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 200 });
  }
}
