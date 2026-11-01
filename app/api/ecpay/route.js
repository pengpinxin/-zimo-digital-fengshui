import { NextResponse } from 'next/server';
import crypto from 'crypto';

function genSign(p, key, iv) {
  const keys = Object.keys(p).sort();
  let s = `HashKey=${key}`;
  keys.forEach(k => {
    s += `&${k}=${p[k]}`;
  });
  s += `&HashIV=${iv}`;
  
  const enc = encodeURIComponent(s)
    .toLowerCase()
    .replace(/%2d/g, '-')
    .replace(/%5f/g, '_')
    .replace(/%2e/g, '.')
    .replace(/%21/g, '!')
    .replace(/%2a/g, '*')
    .replace(/%28/g, '(')
    .replace(/%29/g, ')')
    .replace(/%20/g, '+');
    
  const h = crypto.createHash('sha256');
  h.update(enc);
  return h.digest('hex').toUpperCase();
}

export async function POST(req) {
  try {
    const body = await req.json();
    const { totalAmount, itemName } = body;

    const MerchantID = '2000132';
    const HashKey = '5294y06JbISpM5x9';
    const HashIV = 'v77hoKGq4kWxypIS';
    
    const ECPayURL = 
      'https://payment-stage.ecpay.com.tw' +
      '/Cashier/AioCheckOut/V5';

    const t = new Date().getTime();
    const MerchantTradeNo = `ZIMO${t}`;
    
    const MerchantTradeDate = new Date()
      .toLocaleString('zh-TW', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: false,
      })
      .replace(/\//g, '/');

    const domain = 
      'https://pengpinxin-web.vercel.app';

    const baseParams = {
      MerchantID: MerchantID,
      MerchantTradeNo: MerchantTradeNo,
      MerchantTradeDate: MerchantTradeDate,
      PaymentType: 'aio',
      TotalAmount: totalAmount.toString(),
      TradeDesc: '品心美學結緣',
      ItemName: itemName,
      ReturnURL: domain + 
      '/api/ecpay/callback',
      ClientBackURL: domain + '/',
      ChoosePayment: 'ALL',
      EncryptType: '1',
    };

    const CheckMacValue = genSign(
      baseParams, 
      HashKey, 
      HashIV
    );
    
    const params = {
      ...baseParams,
      CheckMacValue
    };

    return NextResponse.json({
      success: true,
      MerchantTradeNo,
      ECPayURL,
      params
    });
    
  } catch (err) {
    return NextResponse.json({
      success: false,
      error: err.message
    }, {
      status: 500
    });
  }
}
