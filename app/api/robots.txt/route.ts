import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const robotsTxt = `User-agent: *
Allow: /

Sitemap: https://linpack.vercel.app/api/sitemap.xml
`;

    return new NextResponse(robotsTxt, {
      status: 200,
      headers: {
        'Content-Type': 'text/plain',
        'Cache-Control': 'public, max-age=3600',
      },
    });
  } catch (error) {
    console.error('Robots.txt generation error:', error);
    return new NextResponse('Error generating robots.txt', { status: 500 });
  }
}