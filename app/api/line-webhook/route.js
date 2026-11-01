import { NextResponse } from 'next/server';

// 處理 LINE 傳送的 Webhook 事件
export async function POST(request) {
  try {
    const body = await request.json();
    console.log('收到 LINE Webhook 事件:', body);

    // 回傳 200 讓 LINE 知道接收成功
    return NextResponse.json({ status: 'success' }, { status: 200 });
  } catch (error) {
    console.error('LINE Webhook 錯誤:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

// 支援 GET 測試連線
export async function GET() {
  return NextResponse.json({ status: 'LINE Webhook is running' }, { status: 200 });
}
