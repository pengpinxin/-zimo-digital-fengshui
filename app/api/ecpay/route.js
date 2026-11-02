import { NextResponse } from 'next/server';

export async function POST(request) {
  try {
    const body = await request.json();
    
    // 取得綠界回傳或前端送來的訂單資訊
    const { tradeNo, tradeDate, itemName, totalAmount, customerEmail, customerPhone, remark } = body;

    // 組合要寄給您的訂單通知信內容
    const emailContent = `
【品心美學官網新訂單通知】

・訂單編號：${tradeNo || '未提供'}
・訂單時間：${tradeDate || new Date().toLocaleString()}

【購買品項】
${itemName || '數字命理／風水服務'}

【總金額】
NT$ ${totalAmount || 0}

【客戶資訊與備註】
・客戶信箱：${customerEmail || '未填寫'}
・聯絡電話：${customerPhone || '未填寫'}
・備註說明：${remark || '無'}
    `.trim();

    // 使用 Resend API 發送 Email 到您的指定信箱
    const resendResponse = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.RESEND_API_KEY}`
      },
      body: JSON.stringify({
        from: '品心美學官網 <onboarding@resend.dev>', // 可改為您的專屬發信域名
        to: ['Aaa0987955906aaa@gmail.com'],
        subject: `【新訂單通知】NT$ ${totalAmount || 0} - ${itemName || '品心美學服務'}`,
        text: emailContent
      })
    });

    if (!resendResponse.ok) {
      const errorData = await resendResponse.json();
      console.error('發送郵件失敗:', errorData);
      return NextResponse.json({ success: false, error: 'Email sending failed' }, { status: 500 });
    }

    return NextResponse.json({ success: true, message: '訂單成立並已成功寄送 Email 通知！' });

  } catch (error) {
    console.error('處理訂單錯誤:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

