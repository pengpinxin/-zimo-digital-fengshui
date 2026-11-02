import { NextResponse } from 'next/server';
import crypto from 'crypto';

function generateCheckMacValue(params, hashKey, hashIV) {
  const sortedKeys = Object.keys(params).sort();
  let queryStr = `HashKey=${hashKey}`;
  for (const key of sortedKeys) {
    queryStr += `&${key}=${params[key]}`;
  }
  queryStr += `&HashIV=${hashIV}`;

  let encoded = encodeURIComponent(queryStr)
    .toLowerCase()
    .replace(/%20/g, '+')
    .replace(/%21/g, '!')
    .replace(/%2a/g, '*')
    .replace(/%27/g, "'")
    .replace(/%28/g, '(')
    .replace(/%29/g, ')')
    .replace(/%2d/g, '-')
    .replace(/%2e/g, '.')
    .replace(/%5f/g, '_');

  return crypto.createHash('sha256').update(encoded).digest('hex').toUpperCase();
}

export async function POST(request) {
  try {
    const body = await request.json();
    const { items, total } = body;

    if (!items || items.length === 0 || !total) {
      return NextResponse.json({ success: false, message: '購物車是空的或金額有誤' }, { status: 400 });
    }

    const merchantId = process.env.ECPAY_MERCHANT_ID || '3518432';
    const hashKey = process.env.ECPAY_HASH_KEY || '';
    const hashIV = process.env.ECPAY_HASH_IV || '';

    const merchantTradeNo = 'Z' + Date.now().toString().slice(-14);
    
    // 強制取得台灣時間 (UTC+8)
    const now = new Date();
    const utcTime = now.getTime() + (now.getTimezoneOffset() * 60000);
    const taiwanTime = new Date(utcTime + (3600000 * 8));
    
    const year = taiwanTime.getFullYear();
    const month = String(taiwanTime.getMonth() + 1).padStart(2, '0');
    const day = String(taiwanTime.getDate()).padStart(2, '0');
    const hour = String(taiwanTime.getHours()).padStart(2, '0');
    const minute = String(taiwanTime.getMinutes()).padStart(2, '0');
    const second = String(taiwanTime.getSeconds()).padStart(2, '0');
    const merchantTradeDate = `${year}/${month}/${day} ${hour}:${minute}:${second}`;

    const itemNameStr = items.map((i, idx) => `ServiceItem${idx+1}`).join('#');

    // 強制對齊綠界後台已登記的官方網址
    const baseUrl = 'https://pengpinxin.com';

    const baseParams = {
      MerchantID: merchantId,
      MerchantTradeNo: merchantTradeNo,
      MerchantTradeDate: merchantTradeDate,
      PaymentType: 'aio',
      TotalAmount: Math.round(total).toString(),
      TradeDesc: 'PinXinMeixueOrder',
      ItemName: itemNameStr,
      ReturnURL: `${baseUrl}/api/ecpay/callback`,
      ClientBackURL: `${baseUrl}/`,
      ChoosePayment: 'Credit',
      EncryptType: '1',
    };

    const checkMacValue = generateCheckMacValue(baseParams, hashKey, hashIV);

    const allParams = {
      ...baseParams,
      CheckMacValue: checkMacValue,
    };

    const ecpayGatewayUrl = 'https://payment.ecpay.com.tw/Cashier/AioCheckOut/V5';

    let formHtml = `<!DOCTYPE html>
    <html>
    <head><meta charset="utf-8"><title>正在導向綠界金流...</title></head>
    <body>
    <form id="ecpayForm" method="POST" action="${ecpayGatewayUrl}">`;
    
    for (const key in allParams) {
      formHtml += `<input type="hidden" name="${key}" value="${allParams[key]}" />`;
    }

    formHtml += `</form>
    <script>document.getElementById('ecpayForm').submit();</script>
    </body>
    </html>`;

    return NextResponse.json({
      success: true,
      htmlForm: formHtml
    });

  } catch (error) {
    console.error('ECPay API Error:', error);
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}
