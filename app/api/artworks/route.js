import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export async function GET() {
  try {
    const artworksDir = path.join(process.cwd(), 'public', 'artworks');
    
    if (!fs.existsSync(artworksDir)) {
      return NextResponse.json({ success: true, artworks: [] });
    }

    const files = fs.readdirSync(artworksDir);
    const imageFiles = files.filter(file => /\.(jpg|jpeg|png|webp|gif)$/i.test(file));
    imageFiles.sort((a, b) => b.localeCompare(a));

    const artworks = imageFiles.map((filename, index) => {
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
