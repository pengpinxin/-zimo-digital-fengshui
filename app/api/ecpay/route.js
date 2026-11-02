import { NextResponse } from 'next/server';

export async function POST(request) {
  try {
    const body = await request.json();
    
    // 取得前端送來的訂單資訊
    const { tradeNo, tradeDate, itemName, totalAmount, customerEmail, customerPhone, remark } = body;

    // 組合要寄給您的訂單通知信內容
    const emailContent = `
【品心美學官網新訂單通知】

· 訂單編號：${tradeNo || '未提供'}
· 訂單時間：${tradeDate || new Date().toLocaleString()}

【購買品項】
${itemName || '數字命理/風水服務'}

【總金額】
NT$ ${totalAmount || 0}

【客戶資訊與備註】
· 客戶信箱：${customerEmail || '未填寫'}
· 聯絡電話：${customerPhone || '未填寫'}
· 備註說明：${remark || '無'}
    `.trim();

    // 使用 Resend API 發送 Email 到您的指定信箱（嚴格全小寫）
    const resendResponse = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.RESEND_API_KEY}`
      },
      body: JSON.stringify({
        from: 'Acme <onboarding@resend.dev>',
        to: ['aaa0987955906aaa@gmail.com'],
        subject: `【新訂單通知】${tradeNo || '品心美學官網'}`,
        text: emailContent
      })
    });

    const resendData = await resendResponse.json();

    if (!resendResponse.ok) {
      throw new Error(resendData.message || 'Resend 發信失敗');
    }

    return NextResponse.json({ success: true, message: '訂單已成立且郵件已發送' });

  } catch (error) {
    console.error('後端發信異常:', error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
