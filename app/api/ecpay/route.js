import { NextResponse } from 'next/server';
import crypto from 'crypto';

// 產生綠界 CheckMacValue 檢查碼的標準演算法
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

    // 產生唯一的訂單編號
    const merchantTradeNo = 'Z' + Date.now().toString().slice(-14);
    
    // 格式化交易時間 (綠界規定格式：yyyy/MM/dd HH:mm:ss)
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    const hour = String(now.getHours()).padStart(2, '0');
    const minute = String(now.getMinutes()).padStart(2, '0');
    const second = String(now.getSeconds()).padStart(2, '0');
    const merchantTradeDate = `${year}/${month}/${day} ${hour}:${minute}:${second}`;

    // 商品名稱串接
    const itemNameStr = items.map(i => `${i.name} x1`).join('#').substring(0, 200);

    const host = request.headers.get('host') || 'pinxinmeixue.com';
    const protocol = request.headers.get('x-forwarded-proto') || 'https';
    const baseUrl = `${protocol}://${host}`;

    const baseParams = {
      MerchantID: merchantId,
      MerchantTradeNo: merchantTradeNo,
      MerchantTradeDate: merchantTradeDate,
      PaymentType: 'aio',
      TotalAmount: Math.round(total).toString(),
      TradeDesc: '品心美學線上服務與文創',
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

    // 綠界正式金流網址
    const ecpayGatewayUrl = 'https://payment.ecpay.com.tw/Cashier/AioCheckOut/V5';

    // 產生自動送出的 HTML 表單讓前端直接導向綠界
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
