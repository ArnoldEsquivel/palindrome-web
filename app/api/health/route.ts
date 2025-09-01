import { NextResponse } from 'next/server';

export async function GET() {
  try {
    // Basic health check
    const health = {
      status: 'ok',
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      service: 'palindrome-web',
      version: process.env.npm_package_version || '1.0.0',
      environment: process.env.NODE_ENV || 'development',
    };

    return NextResponse.json(health, { status: 200 });
  } catch (_error) {
    // Health check failed - return error status
    return Response.json(
      { 
        status: 'error',
        timestamp: new Date().toISOString(),
        message: 'Health check failed'
      },
      { status: 500 }
    );
  }
}
