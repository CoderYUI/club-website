import { NextResponse } from 'next/server';

export async function GET() {
  return new NextResponse(JSON.stringify({ 
    status: 'ok', 
    message: 'Vercel deployment is working correctly',
    timestamp: new Date().toISOString()
  }), {
    status: 200,
    headers: {
      'Content-Type': 'application/json',
    },
  });
}