import { NextResponse } from 'next/server';

export async function POST(request) {
  try {
    const bodyText = await request.text();
    const body = bodyText ? JSON.parse(bodyText) : {};

    console.log('收到 LINE Webhook 事件:', body);

    return NextResponse.json({ status: 'success' }, { status: 200 });
  } catch (error) {
    console.error('LINE Webhook 錯誤:', error);
    return NextResponse.json({ status: 'success' }, { status: 200 });
  }
}

export async function GET() {
  return NextResponse.json({ status: 'LINE Webhook is running' }, { status: 200 });
}
