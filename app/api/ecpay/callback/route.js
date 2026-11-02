import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

// 設定您的 Gmail 寄信工具（使用 Google 應用程式密碼 App Password）
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'aaa0987955906aaa@gmail.com',
    pass: '您的Gmail應用程式密碼', 
  },
});

export async function POST(request) {
  try {
    const formData = await request.formData();
    const data = Object.fromEntries(formData.entries());

    // 檢查是否付款成功 (RtnCode === '1' 代表成功)
    if (data.RtnCode === '1') {
      const merchantTradeNo = data.MerchantTradeNo;
      const totalAmount = data.TradeAmt;
      const customerName = data.CustomField1;
      const customerPhone = data.CustomField2;
      const shippingAddress = data.CustomField3;
      const customerEmail = data.CustomField4;
      const itemName = data.ItemName;

      // 1. 寄信通知老闆（您）準備出貨，清楚標註收件地址
      const bossMailOptions = {
        from: '"品心書閣系統" <aaa0987955906aaa@gmail.com>',
        to: 'aaa0987955906aaa@gmail.com',
        subject: `【新訂單成立】請安排出貨 - 訂單編號：${merchantTradeNo}`,
        html: `
          <h2>🎉 恭喜老師！網站進新訂單囉！</h2>
          <p><strong>訂單編號：</strong>${merchantTradeNo}</p>
          <p><strong>購買品項：</strong>${itemName}</p>
          <p><strong>付款金額：</strong>NT$ ${totalAmount}</p>
          <hr/>
          <h3>📦 收件人資訊：</h3>
          <p><strong>姓名：</strong>${customerName}</p>
          <p><strong>電話：</strong>${customerPhone}</p>
          <p><strong>收件地址：</strong><span style="color: red; font-size: 16px;">${shippingAddress}</span></p>
          <p><strong>電子信箱：</strong>${customerEmail}</p>
          <hr/>
          <p>請盡快將商品寄出，祝您生意興隆！</p>
        `,
      };

      // 2. 寄信通知客人「訂購與付款成功」
      const customerMailOptions = {
        from: '"品心美學 · 品心書閣" <aaa0987955906aaa@gmail.com>',
        to: customerEmail,
        subject: `【品心美學】您的訂單已付款成功（訂單編號：${merchantTradeNo}）`,
        html: `
          <h2>親愛的 ${customerName} 您好：</h2>
          <p>感謝您購買「品心美學 / 品心書閣」的著作與服務！您的款項已透過綠界安全結帳完成。</p>
          <hr/>
          <p><strong>訂單編號：</strong>${merchantTradeNo}</p>
          <p><strong>訂購項目：</strong>${itemName}</p>
          <p><strong>付款金額：</strong>NT$ ${totalAmount}</p>
          <p><strong>收件地址：</strong>${shippingAddress}</p>
          <hr/>
          <p>我們將會盡快為您安排寄送服務。若有任何疑問，歡迎隨時透過官方管道與我們聯繫。</p>
          <p>祝您生活愉快，平安喜樂！<br/><strong>紫墨老師 彭品心 敬上</strong></p>
        `,
      };

      // 發送郵件
      if (customerEmail) {
        await transporter.sendMail(customerMailOptions);
      }
      await transporter.sendMail(bossMailOptions);
    }

    // 必須回傳 1|OK 給綠界，告知已成功接收通知
    return new Response('1|OK', { status: 200 });
  } catch (error) {
    console.error('Callback Error:', error);
    return new Response('0|Error', { status: 500 });
  }
}
