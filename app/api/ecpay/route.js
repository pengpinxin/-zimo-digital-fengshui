import { NextResponse } from 'next/server';
import crypto from 'crypto';

// 產生綠界檢查碼 (CheckMacValue)
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
    const { itemName, totalAmount, customerName, customerPhone, customerEmail, shippingAddress, remark } = body;

    // 綠界特店參數（請確保與您的綠界後台一致）
    const MerchantID = '3002607'; 
    const HashKey = '您的HashKey';
    const HashIV = '您的HashIV';
    const baseUrl = 'https://pengpinxin.com';

    // 產生唯一訂單編號 (以時間戳記為主)
    const MerchantTradeDate = new Date().toLocaleString('zh-TW', { timeZone: 'Asia/Taipei', hour12: false }).replace(/\//g, '/');
    const formattedDate = MerchantTradeDate.replace(/[- :]/g, '').slice(0, 14);
    const MerchantTradeNo = 'PX' + formattedDate + Math.floor(1000 + Math.random() * 9000);

    const baseParams = {
      MerchantID: MerchantID,
      MerchantTradeNo: MerchantTradeNo,
      MerchantTradeDate: formattedDate,
      PaymentType: 'aio',
      TotalAmount: String(totalAmount),
      TradeDesc: 'PinXinMeixueOrder',
      ItemName: itemName || '品心美學服務與書籍',
      ReturnURL: `${baseUrl}/api/ecpay/callback`, // 幕後付款成功通知網址
      ClientBackURL: `${baseUrl}/order-success?orderno=${MerchantTradeNo}`, // 付款後客人返回的網址
      ChoosePayment: 'Credit',
      EncryptType: '1',
      // 將客人的收件資訊藏在綠界的自定義欄位中（解決無資料庫問題）
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

    // 導向綠界刷卡頁面的 URL (正式環境)
    const ecpayGatewayUrl = 'https://payment.ecpay.com.tw/Cashier/AioCheckOut/V5';

    return NextResponse.json({
      success: true,
      gatewayUrl: ecpayGatewayUrl,
      params: ecpayParams,
    });
  } catch (error) {
    console.error('ECPay Error:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
