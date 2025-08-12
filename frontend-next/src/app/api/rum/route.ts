import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    // Read the body to avoid unhandled stream, but we don't use it here
    await request.json();
    // TODO: forward to your analytics sink (PostHog/GA4/OTLP). For now, no-op.
    // Example: await fetch(process.env.RUM_SINK!, { method: 'POST', body: JSON.stringify(data) })
    return NextResponse.json({ ok: true }, { status: 202 });
  } catch {
    return NextResponse.json({ ok: false }, { status: 400 });
  }
}
