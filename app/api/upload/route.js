import { NextResponse } from 'next/server';

export async function POST(request) {
  try {
    const { filename, content, artwork } = await request.json();
    const token = process.env.GITHUB_TOKEN;
    const repo = process.env.GITHUB_REPO; 
    const owner = process.env.GITHUB_OWNER; 

    if (!token || !repo || !owner) {
      return NextResponse.json({ success: false, error: 'GitHub 環境變數未設定' }, { status: 500 });
    }

    const headers = {
      'Authorization': `Bearer ${token}`,
      'Accept': 'application/vnd.github+json',
      'Content-Type': 'application/json',
    };

    // 1. 上傳圖片檔案到 GitHub
    const imageRes = await fetch(`https://api.github.com/repos/${owner}/${repo}/contents/${filename}`, {
      method: 'PUT',
      headers,
      body: JSON.stringify({
        message: `Upload image ${filename}`,
        content: content,
      }),
    });
    const imageData = await imageRes.json();
    if (!imageRes.ok) throw new Error(imageData.message || '圖片上傳失敗');
    const imageUrl = imageData.content.download_url;

    // 2. 同步更新雲端 artworks.json 清單
    if (artwork) {
      const jsonPath = 'artworks.json';
      let fileSha = null;
      let artworksList = [];

      const getFileRes = await fetch(`https://api.github.com/repos/${owner}/${repo}/contents/${jsonPath}`, {
        headers,
      });
      if (getFileRes.ok) {
        const fileData = await getFileRes.json();
        fileSha = fileData.sha;
        const decodedContent = Buffer.from(fileData.content, 'base64').toString('utf8');
        artworksList = JSON.parse(decodedContent);
      }

      artworksList.unshift({ ...artwork, img: imageUrl });

      await fetch(`https://api.github.com/repos/${owner}/${repo}/contents/${jsonPath}`, {
        method: 'PUT',
        headers,
        body: JSON.stringify({
          message: 'Update artworks list',
          content: Buffer.from(JSON.stringify(artworksList, null, 2)).toString('base64'),
          sha: fileSha,
        }),
      });
    }

    return NextResponse.json({ success: true, url: imageUrl });
  } catch (err) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
