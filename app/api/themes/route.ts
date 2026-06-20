import { NextRequest, NextResponse } from 'next/server';
import { DEFAULT_THEMES } from '@/lib/themes';

export async function GET() {
  try {
    return NextResponse.json({
      themes: DEFAULT_THEMES,
    });
  } catch (error) {
    console.error('Error fetching themes:', error);
    return NextResponse.json(
      { error: 'Failed to load themes' },
      { status: 500 }
    );
  }
}
