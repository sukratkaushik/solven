import { NextRequest, NextResponse } from 'next/server';
import { runInsolvencySentinel } from '@/lib/insolvency-sentinel';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  // Validate bearer token or cron secret to prevent unauthorized public invocation
  const authHeader = request.headers.get('authorization');
  const cronSecret = process.env.CRON_SECRET;

  if (cronSecret && authHeader !== `Bearer ${cronSecret}`) {
    return NextResponse.json({ error: 'Nicht autorisiert' }, { status: 401 });
  }

  try {
    const result = await runInsolvencySentinel();
    return NextResponse.json({
      success: true,
      message: 'Justiz-Scan erfolgreich durchgeführt',
      result,
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Sentinel Fehler';
    console.error('Sentinel Cron failed:', error);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
