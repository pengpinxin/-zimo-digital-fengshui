import { NextResponse } from 'next/server';

export async function POST(request) {
  try {
    const body = await request.json();
    const { totalAmount, itemName, customerName, customerPhone, customerEmail, customerAddress, customerRemark } = body;

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

    // 組織完整的訂單內容
    const messageContent = `【品心美學官網新訂單通知】\n\n訂單編號：${MerchantTradeNo}\n訂單時間：${MerchantTradeDate}\n\n【購買品項】\n${itemName}\n\n【總金額】\nNT$ ${totalAmount}\n\n【客戶聯絡與備註】\n姓名：${customerName}\n電話：${customerPhone}\n信箱：${customerEmail}\n地址：${customerAddress}\n備註需求：${customerRemark}`;

    // 使用 Web3Forms 標準欄位（name, email, subject, message）確保信件穩定寄回您的綁定信箱
    const response = await fetch('https://api.web3forms.com/submit', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        access_key: '23b49742-5311-4475-8468-d053229b1be8',
        subject: `【品心美學新訂單】來自 ${customerName} 的訂單 (${MerchantTradeNo})`,
        name: customerName,
        email: customerEmail,
        message: messageContent
      })
    });

    const result = await response.json();
    if (!result.success) {
      throw new Error(result.message || '郵件發送失敗');
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
