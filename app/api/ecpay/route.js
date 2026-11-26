import { NextResponse } from 'next/server';
import crypto from 'crypto';
import nodemailer from 'nodemailer';

const MerchantID = process.env.ECPAY_MERCHANT_ID || '3518432';
const HashKey = process.env.ECPAY_HASH_KEY || 'mvDQgLp0Jb1yR940';
const HashIV = process.env.ECPAY_HASH_IV || 'bUZWJsz26zUGE1UP';
const baseUrl = 'https://www.pengpinxin.com';

function generateCheckMacValue(params, hashKey, hashIV) {
  const sortedKeys = Object.keys(params).sort((a, b) =>
    a.toLowerCase().localeCompare(b.toLowerCase())
  );

  let queryStr = sortedKeys.map((key) => `${key}=${params[key]}`).join('&');
  queryStr = `HashKey=${hashKey}&${queryStr}&HashIV=${hashIV}`;

  const encoded = encodeURIComponent(queryStr)
    .replace(/%20/g, '+')
    .replace(/'/g, '%27')
    .replace(/~/g, '%7e')
    .toLowerCase();

  return crypto.createHash('sha256').update(encoded).digest('hex').toUpperCase();
}

function getTaiwanDateParts() {
  const tw = new Date(Date.now() + 8 * 60 * 60 * 1000);
  const year = tw.getUTCFullYear();
  const month = String(tw.getUTCMonth() + 1).padStart(2, '0');
  const day = String(tw.getUTCDate()).padStart(2, '0');
  const hours = String(tw.getUTCHours()).padStart(2, '0');
  const minutes = String(tw.getUTCMinutes()).padStart(2, '0');
  const seconds = String(tw.getUTCSeconds()).padStart(2, '0');
  return {
    tradeDate: `${year}/${month}/${day} ${hours}:${minutes}:${seconds}`,
    compactDate: `${year}${month}${day}${hours}${minutes}${seconds}`,
  };
}

export async function POST(request) {
  try {
    const body = await request.json();
    const {
      itemName,
      totalAmount,
      customerName,
      customerPhone,
      customerEmail,
      shippingAddress,
      remark,
      note,
    } = body;

    const amount = Math.round(Number(totalAmount) || 0);
    if (amount <= 0) {
      return NextResponse.json({ success: false, error: '訂單金額無效' }, { status: 400 });
    }

    const finalItemName = String(itemName || '品心美學服務與書籍').trim().slice(0, 400);
    const finalRemark = String(remark || note || '').trim();
    const { tradeDate, compactDate } = getTaiwanDateParts();
    const MerchantTradeNo = 'PX' + compactDate + Math.floor(100 + Math.random() * 900);

    // 結帳前先寄完整訂單與備註給老師（避免綠界 50 字截斷與漏掉商品名稱/備註）
    if (process.env.GMAIL_APP_PASSWORD) {
      try {
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
          subject: `【待付款明細】訂單編號：${MerchantTradeNo}`,
          html: `
            <h3>客人已前往綠界刷卡（請以「已付款成功」通知信為準出貨）</h3>
            <p><strong>訂單編號：</strong>${MerchantTradeNo}</p>
            <p><strong>購買品項：</strong>${finalItemName}</p>
            <p><strong>實付金額：</strong>NT$ ${amount}</p>
            <hr/>
            <p><strong>姓名：</strong>${customerName || ''}</p>
            <p><strong>電話：</strong>${customerPhone || ''}</p>
            <p><strong>信箱：</strong>${customerEmail || ''}</p>
            <p><strong>完整收件地址：</strong><span style="color:red;font-weight:bold;">${shippingAddress || ''}</span></p>
            <p><strong>客人備註（生辰／換號／贈畫）：</strong><span style="color:#b5651d;font-weight:bold;">${finalRemark || '無'}</span></p>
          `,
        });
      } catch (mailErr) {
        console.error('Pre-order email error:', mailErr);
      }
    }

    const baseParams = {
      MerchantID,
      MerchantTradeNo,
      MerchantTradeDate: tradeDate,
      PaymentType: 'aio',
      TotalAmount: String(amount),
      TradeDesc: 'PinXinMeixueOrder',
      ItemName: finalItemName,
      ReturnURL: `${baseUrl}/api/ecpay/callback`,
      ClientBackURL: `${baseUrl}/order-success?orderno=${MerchantTradeNo}&amount=${amount}`,
      ChoosePayment: 'Credit',
      EncryptType: '1',
      CustomField1: String(customerName || '').trim().slice(0, 50),
      CustomField2: String(customerPhone || '').trim().slice(0, 50),
      CustomField3: String(shippingAddress || '').trim().slice(0, 50),
      CustomField4: String(customerEmail || '').trim().slice(0, 50),
    };

    const CheckMacValue = generateCheckMacValue(baseParams, HashKey, HashIV);

    return NextResponse.json({
      success: true,
      gatewayUrl: 'https://payment.ecpay.com.tw/Cashier/AioCheckOut/V5',
      params: { ...baseParams, CheckMacValue },
    });
  } catch (error) {
    console.error('ECPay Error:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
