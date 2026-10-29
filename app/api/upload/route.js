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
    const contentBase64 = buffer.toString('base64');

    // 正確的倉庫名稱：-zimo-digital-fengshui
    const owner = 'pengpinxin';
    const repo = '-zimo-digital-fengshui';
    const token = process.env.GITHUB_TOKEN || process.env.GH_TOKEN;

    if (!token) {
      return NextResponse.json({ success: false, error: '尚未設定 GITHUB_TOKEN 密鑰' }, { status: 500 });
    }

    const filename = file.name || 'upload.jpg';
    const cleanFilename = filename.replace(/[^a-zA-Z0-9_.-]/g, '');
    const filePath = `public/artworks/${Date.now()}_${cleanFilename}`;

    const githubRes = await fetch(`https://api.github.com/repos/${owner}/${repo}/contents/${filePath}`, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
        'User-Agent': 'Pinxin-Art-App'
      },
      body: JSON.stringify({
        message: `Upload artwork: ${cleanFilename}`,
        content: contentBase64,
        branch: 'main'
      })
    });

    if (!githubRes.ok) {
      const errText = await githubRes.text();
      return NextResponse.json({ success: false, error: `GitHub 寫入失敗: ${errText}` }, { status: 500 });
    }

    const publicUrl = `/${filePath.replace('public/', '')}`;

    return NextResponse.json({
      success: true,
      url: publicUrl,
      name: artName,
      wm: artWm
    });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
