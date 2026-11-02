import { NextResponse } from 'next/server';
import crypto from 'crypto';

// 綠界標準檢查碼 (CheckMacValue) 產生邏輯
function generateCheckMacValue(params, hashKey, hashIV) {
  const sortedParams = Object.keys(params)
    .sort()
    .reduce((acc, key) => {
      acc[key] = params[key];
      return acc;
    }, {});

  let queryStr = Object.keys(sortedParams)
    .map((key) => `${key}=${sortedParams[key]}`)
    .join('&');

  queryStr = `HashKey=${hashKey}&${queryStr}&HashIV=${hashIV}`;

  const encoded = encodeURIComponent(queryStr)
    .toLowerCase()
    .replace(/%20/g, '+')
    .replace(/%21/g, '!')
    .replace(/%2a/g, '*')
    .replace(/%27/g, "'")
    .replace(/%28/g, '(')
    .replace(/%29/g, ')');

  return crypto.createHash('sha256').update(encoded).digest('hex').toUpperCase();
}

export async function POST(request) {
  try {
    const body = await request.json();
    const { itemName, totalAmount, customerName, customerPhone, customerEmail, shippingAddress } = body;

    // 您正確的官方綠界正式帳號參數
    const MerchantID = '3518432';
    const HashKey = 'mvDQgLp0Jb1yR940';
    const HashIV = 'bUZWJsz26zUGE1UP';
    const baseUrl = 'https://pengpinxin.com';

    // 產生標準綠界時間格式
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    const seconds = String(now.getSeconds()).padStart(2, '0');
    
    const MerchantTradeDate = `${year}/${month}/${day} ${hours}:${minutes}:${seconds}`;
    const formattedDate = `${year}${month}${day}${hours}${minutes}${seconds}`;
    const MerchantTradeNo = 'PX' + formattedDate + Math.floor(100 + Math.random() * 900);

    const baseParams = {
      MerchantID: MerchantID,
      MerchantTradeNo: MerchantTradeNo,
      MerchantTradeDate: MerchantTradeDate,
      PaymentType: 'aio',
      TotalAmount: String(totalAmount),
      TradeDesc: 'PinXinMeixueOrder',
      ItemName: itemName || '品心美學服務與書籍',
      ReturnURL: `${baseUrl}/api/ecpay/callback`,
      ClientBackURL: `${baseUrl}/order-success?orderno=${MerchantTradeNo}`,
      ChoosePayment: 'Credit',
      EncryptType: '1',
      // 夾帶收件資訊，免資料庫自動收地址
      CustomField1: customerName || '',
      CustomField2: customerPhone || '',
      CustomField3: shippingAddress || '',
      CustomField4: customerEmail || '',
    };

    const CheckMacValue = generateCheckMacValue(baseParams, HashKey, HashIV);

    const ecpayParams = {
      ...baseParams,
      CheckMacValue,
    };

    // 直接組合成標準的自動提交 HTML 表單回傳給瀏覽器，強制跳轉綠界
    const formInputs = Object.keys(ecpayParams)
      .map(key => `<input type="hidden" name="${key}" value="${ecpayParams[key]}">`)
      .join('');

    const html = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <title>正在導向綠界安全結帳...</title>
        </head>
        <body onload="document.getElementById('ecpayForm').submit();">
          <form id="ecpayForm" action="https://payment.ecpay.com.tw/Cashier/AioCheckOut/V5" method="POST">
            ${formInputs}
          </form>
          <div style="text-align: center; margin-top: 20vh; font-family: sans-serif; color: #333;">
            <h2>正在安全連接綠界科技，請稍候...</h2>
            <p>系統正在為您跳轉至刷卡頁面</p>
          </div>
        </body>
      </html>
    `;

    return new NextResponse(html, {
      headers: { 'Content-Type': 'text/html; charset=utf-8' },
    });

  } catch (error) {
    console.error('ECPay Error:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
