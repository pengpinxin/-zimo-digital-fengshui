import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export async function GET() {
  try {
    const artworksDir = path.join(process.cwd(), 'public', 'artworks');
    
    // 如果資料夾不存在，回傳空陣列
    if (!fs.existsSync(artworksDir)) {
      return NextResponse.json({ success: true, artworks: [] });
    }

    // 自動讀取 public/artworks 裡的所有圖片檔案
    const files = fs.readdirSync(artworksDir);
    const imageFiles = files.filter(file => /\.(jpg|jpeg|png|webp|gif)$/i.test(file));
    
    // 依檔名排序（讓最新的藏品排在最前面）
    imageFiles.sort((a, b) => b.localeCompare(a));

    const artworks = imageFiles.map((filename, index) => {
      // 自動將檔名轉為美觀的畫作名稱（去掉副檔名，把底線橫線轉空格）
      const cleanName = filename.substring(0, filename.lastIndexOf('.')) || `原創藝術藏品 #${index + 1}`;
      
      return {
        name: cleanName.replace(/[-_]/g, ' '),
        wm: '品心美學 · 彭品心原創',
        url: `/artworks/${filename}`,
        price: 680,
        size: '1000px 高畫質防盜保護'
      };
    });

    return NextResponse.json({ success: true, artworks });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
