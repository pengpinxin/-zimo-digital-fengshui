import { NextResponse } from 'next/server';
import crypto from 'crypto';

export async function POST(request) {
  try {
    const body = await request.json();
    const { totalAmount, itemName, customerName, customerPhone, customerEmail, customerAddress, customerRemark } = body;

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

    // 嚴格過濾商品名稱中的特殊字元與括號，確保綠界正確接收
    const cleanItemName = (itemName || '品心美學商品').replace(/[()#,]/g, '');

    const baseParams = {
      MerchantID,
      MerchantTradeNo,
      MerchantTradeDate,
      PaymentType: 'aio',
      TotalAmount: String(totalAmount),
      TradeDesc: '品心美學線上訂單',
      ItemName: cleanItemName,
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

    // 1. 發送詳細訂單通知給商家 (您的信箱)
    try {
      await fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          access_key: '23b49742-5311-4475-8468-d053229b1be8',
          subject: `【品心美學新訂單】來自 ${customerName || '緣主'} 的訂單 (${MerchantTradeNo})`,
          from_name: '品心美學官網訂單系統',
          to: 'Aaa0987955906aaa@gmail.com',
          message: `【品心美學官網新訂單通知】\n\n訂單編號：${MerchantTradeNo}\n訂單時間：${MerchantTradeDate}\n\n【購買品項】\n${itemName}\n\n【總金額】\nNT$ ${totalAmount}\n\n【客戶聯絡與備註】\n姓名：${customerName}\n電話：${customerPhone}\n信箱：${customerEmail}\n地址：${customerAddress}\n備註需求：${customerRemark}`
        })
      });
    } catch (mailErr) {
      console.error('Merchant Email send error:', mailErr);
    }

    // 2. 發送溫馨確認信給客人
    if (customerEmail) {
      try {
        await fetch('https://api.web3forms.com/submit', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            access_key: '23b49742-5311-4475-8468-d053229b1be8',
            subject: `【品心美學】訂單確認與溫馨通知`,
            from_name: '品心美學',
            to: customerEmail,
            message: `尊敬的 ${customerName || '緣主'} 您好：\n\n謝謝您的喜歡，商家已收到您的訂單通知，請您悉心等候商家寄出商品或回复！\n\n【您的訂單明細】\n訂單編號：${MerchantTradeNo}\n購買品項：${itemName}\n總金額：NT$ ${totalAmount}\n\n如您有其它相關問題，請您添加品心美學官方LINE說明詳細信息，祝您生活順心愉快，謝謝您💕\n\n品心美學 敬上`
          })
        });
      } catch (clientMailErr) {
        console.error('Client Email send error:', clientMailErr);
      }
    }

    return NextResponse.json({
      success: true,
      ECPayURL,
      params: { ...baseParams, CheckMacValue }
    });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
