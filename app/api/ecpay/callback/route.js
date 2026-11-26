import crypto from 'crypto';
import nodemailer from 'nodemailer';

const HashKey = process.env.ECPAY_HASH_KEY || 'mvDQgLp0Jb1yR940';
const HashIV = process.env.ECPAY_HASH_IV || 'bUZWJsz26zUGE1UP';

function generateCheckMacValue(params, hashKey, hashIV) {
  const sortedKeys = Object.keys(params)
    .filter((key) => key !== 'CheckMacValue')
    .sort((a, b) => a.toLowerCase().localeCompare(b.toLowerCase()));

  let queryStr = sortedKeys.map((key) => `${key}=${params[key]}`).join('&');
  queryStr = `HashKey=${hashKey}&${queryStr}&HashIV=${hashIV}`;

  const encoded = encodeURIComponent(queryStr)
    .replace(/%20/g, '+')
    .replace(/'/g, '%27')
    .replace(/~/g, '%7e')
    .toLowerCase();

  return crypto.createHash('sha256').update(encoded).digest('hex').toUpperCase();
}

export async function POST(request) {
  try {
    const formData = await request.formData();
    const data = Object.fromEntries(formData.entries());

    // 1. 驗證綠界檢查碼，防止偽造訂單
    const expectedMac = generateCheckMacValue(data, HashKey, HashIV);
    if (!data.CheckMacValue || expectedMac !== data.CheckMacValue) {
      return new Response('0|CheckMacValue Error', { status: 400 });
    }

    // 2. 交易成功才發信
    if (data.RtnCode === '1') {
      const merchantTradeNo = data.MerchantTradeNo || '';
      const totalAmount = data.TradeAmt || '';
      const customerName = data.CustomField1 || '';
      const customerPhone = data.CustomField2 || '';
      const shippingAddress = data.CustomField3 || '';
      const customerEmail = data.CustomField4 || '';

      if (process.env.GMAIL_APP_PASSWORD) {
        const transporter = nodemailer.createTransport({
          service: 'gmail',
          auth: {
            user: 'aaa0987955906aaa@gmail.com',
            pass: process.env.GMAIL_APP_PASSWORD,
          },
        });

        await transporter.sendMail({
          from: '"品心書閣系統" <aaa0987955906aaa@gmail.com>',
          to: 'aaa0987955906aaa@gmail.com',
          subject: `【已付款成功！請出貨】訂單編號：${merchantTradeNo}`,
          html: `
            <h2>🎉 確認已收到款項！請安排出貨／服務</h2>
            <p><strong>訂單編號：</strong>${merchantTradeNo}</p>
            <p><strong>實付金額：</strong>NT$ ${totalAmount}</p>
            <p style="color:#666;">（完整購買品項、長地址與客人備註，請對照同編號的「待付款明細」信件）</p>
            <hr/>
            <p><strong>姓名：</strong>${customerName}</p>
            <p><strong>電話：</strong>${customerPhone}</p>
            <p><strong>收件地址：</strong><span style="color:red;font-weight:bold;">${shippingAddress}</span></p>
            <p><strong>電子信箱：</strong>${customerEmail}</p>
          `,
        });

        if (customerEmail) {
          await transporter.sendMail({
            from: '"品心美學 · 品心書閣" <aaa0987955906aaa@gmail.com>',
            to: customerEmail,
            subject: `【品心美學】您的訂單已付款成功（訂單編號：${merchantTradeNo}）`,
            html: `
              <h2>親愛的 ${customerName} 緣主 您好：</h2>
              <p>感謝您支持「品心美學 / 品心書閣」，您的款項已透過綠界完成結帳。</p>
              <hr/>
              <p><strong>訂單編號：</strong>${merchantTradeNo}</p>
              <p><strong>付款金額：</strong>NT$ ${totalAmount}</p>
              <p><strong>收件地址：</strong>${shippingAddress}</p>
              <hr/>
              <p>我們將盡快為您安排服務或寄送，如有疑問請聯繫官方 LINE：0987955906。</p>
              <p><strong>紫墨老師 彭品心 敬上</strong></p>
            `,
          });
        }
      }
    }

    return new Response('1|OK', { status: 200 });
  } catch (error) {
    console.error('Callback Error:', error);
    return new Response('0|Error', { status: 500 });
  }
}
