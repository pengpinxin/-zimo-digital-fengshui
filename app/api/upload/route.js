import { NextResponse } from 'next/server';

export const runtime = 'nodejs';

export async function POST(request) {
  try {
    const data = await request.formData();
    const file = data.get('file');
    const artName = data.get('artName') || '原創畫作';
    const artWm = data.get('artWm') || '品心美學';

    if (!file) {
      return NextResponse.json({ success: false, error: '沒有找到上傳的檔案' }, { status: 400 });
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const base64Data = buffer.toString('base64');
    const mimeType = file.type || 'image/jpeg';
    const dataUrl = `data:${mimeType};base64,${base64Data}`;

    return NextResponse.json({
      success: true,
      url: dataUrl,
      name: artName,
      wm: artWm
    });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
