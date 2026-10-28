export const runtime = 'nodejs';

import { NextResponse } from 'next/server';

export async function POST(request) {
  try {
    const formData = await request.formData();
    const file = formData.get('file');
    const filename = formData.get('filename') || `art_${Date.now()}.jpg`;

    if (!file) {
      return NextResponse.json({ success: false, error: '沒有上傳檔案' }, { status: 400 });
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    const contentBase64 = buffer.toString('base64');

    const owner = process.env.GITHUB_OWNER || 'pengpinxin';
    const repo = process.env.GITHUB_REPO || '-zimo-digital-fengshui';
    const token = process.env.GITHUB_TOKEN;

    if (!token) {
      return NextResponse.json({ success: false, error: '尚未設定 GITHUB_TOKEN 環境變數' }, { status: 500 });
    }
    
    const cleanFileName = filename.replace(/[^a-zA-Z0-9_.-]/g, '_');
    const path = `public/artworks/${Date.now()}_${cleanFileName}`;

    const githubRes = await fetch(`https://api.github.com/repos/${owner}/${repo}/contents/${path}`, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
        'User-Agent': 'Pinxin-Art-App'
      },
      body: JSON.stringify({
        message: `Upload artwork via mobile: ${cleanFileName}`,
        content: contentBase64,
        branch: 'main'
      })
    });

    const responseText = await githubRes.text();
    let data = {};
    try {
      if (responseText) {
        data = JSON.parse(responseText);
      }
    } catch (e) {}

    if (!githubRes.ok) {
      return NextResponse.json({ success: false, error: data.message || `GitHub 上傳失敗 (${githubRes.status})` }, { status: 500 });
    }

    const publicUrl = `/artworks/${path.split('/').pop()}`;
    return NextResponse.json({ success: true, url: publicUrl });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
