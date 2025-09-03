import { NextResponse } from 'next/server';

// Explicitly define the pages with full paths
const pages = [
  '/',
  '/certificate',
  '/entry',
  '/gallery',
  '/scanner',
  '/ticket'
];

export async function GET() {
  try {
    const baseUrl = 'https://linpack.vercel.app';
    
    const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${pages.map(page => `  <url>
    <loc>${baseUrl}${page === '/' ? '' : page}</loc>
    <changefreq>daily</changefreq>
    <priority>${page === '/' ? '1.0' : '0.8'}</priority>
  </url>`).join('\n')}
</urlset>`;

    return new NextResponse(sitemap, {
      status: 200,
      headers: {
        'Content-Type': 'application/xml',
        'Cache-Control': 'public, max-age=3600',
      },
    });
  } catch (error) {
    console.error('Sitemap generation error:', error);
    return new NextResponse('Error generating sitemap', { status: 500 });
  }
}