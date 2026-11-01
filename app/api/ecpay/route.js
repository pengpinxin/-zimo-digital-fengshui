import { NextResponse } from 'next/server';
import crypto from 'crypto';

export async function POST(request) {
  try {
    const body = await request.json();
    const { totalAmount, itemName } = body;

    const MerchantID = '2000132';
    const HashKey = '5294y06JbISpM5x9';
    const HashIV = 'v77hoKGq4kWxNNIS';
    const ECPayURL = 'https://payment-stage.ecpay.com.tw/Cashier/AIO/Checkout';

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

    const baseParams = {
      MerchantID,
      MerchantTradeNo,
      MerchantTradeDate,
      PaymentType: 'aio',
      TotalAmount: String(totalAmount),
      TradeDesc: '品心美學線上訂單',
      ItemName: itemName || '品心美學商品',
      ReturnURL: 'https://developers.ecpay.com.tw',
      ClientBackURL: 'https://developers.ecpay.com.tw',
      ChoosePayment: 'ALL',
      EncryptType: '1',
    };

    const keys = Object.keys(baseParams).sort();
    let checkString = `HashKey=${HashKey}`;
    keys.forEach((key) => {
      if (baseParams[key] !== undefined && baseParams[key] !== '') {
        checkString += `&${key}=${baseParams[key]}`;
      }
    });
    checkString += `&HashIV=${HashIV}`;

    const dotnetUrlEncode = (str) => {
      return encodeURIComponent(str)
        .replace(/%21/g, '!')
        .replace(/%2A/g, '*')
        .replace(/%27/g, "'")
        .replace(/%28/g, '(')
        .replace(/%29/g, ')')
        .replace(/%20/g, '+');
    };

    const encoded = dotnetUrlEncode(checkString).toLowerCase();
    const CheckMacValue = crypto.createHash('sha256').update(encoded).digest('hex').toUpperCase();

    return NextResponse.json({
      success: true,
      ECPayURL,
      params: { ...baseParams, CheckMacValue }
    });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
