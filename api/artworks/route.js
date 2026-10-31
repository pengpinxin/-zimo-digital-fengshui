import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export async function GET() {
  try {
    // 1. 優先讀取根目錄的 artworks.json 檔案
    const jsonPath = path.join(process.cwd(), 'artworks.json');
    if (fs.existsSync(jsonPath)) {
      const fileContent = fs.readFileSync(jsonPath, 'utf8');
      const artworks = JSON.parse(fileContent);
      if (Array.isArray(artworks) && artworks.length > 0) {
        return NextResponse.json({ success: true, artworks });
      }
    }

    // 2. 備用方案：讀取 public/artworks 資料夾
    const artworksDir = path.join(process.cwd(), 'public', 'artworks');
    if (fs.existsSync(artworksDir)) {
      const files = fs.readdirSync(artworksDir);
      const imageFiles = files.filter(file => /\.(jpg|jpeg|png|webp|gif)$/i.test(file));
      imageFiles.sort((a, b) => b.localeCompare(a));

      const artworks = imageFiles.map(filename => ({
        name: '品心原創藝術',
        wm: '品心美學 · 彭品心原創',
        url: `/artworks/${filename}`,
        price: 680,
        size: '1000px 防盜保護'
      }));

      if (artworks.length > 0) {
        return NextResponse.json({ success: true, artworks });
      }
    }

    return NextResponse.json({ success: true, artworks: [] });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
