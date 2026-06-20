import { NextRequest, NextResponse } from 'next/server';
import { synthesizeNotes } from '@/lib/synthesis';
import type { Theme } from '@/lib/themes';

export const runtime = 'nodejs'; // Required for transformers/WASM
export const maxDuration = 30; // Allow up to 30s for model loading + processing

export async function POST(request: NextRequest) {
  try {
    const { notes, themes, quotesPerTheme = 5 } = await request.json();

    // Validate input
    if (!notes || typeof notes !== 'string' || notes.trim().length === 0) {
      return NextResponse.json(
        { error: 'Invalid input: notes must be a non-empty string' },
        { status: 400 }
      );
    }

    if (!Array.isArray(themes) || themes.length === 0) {
      return NextResponse.json(
        { error: 'Invalid input: must provide at least one theme' },
        { status: 400 }
      );
    }

    // Validate theme structure
    const validatedThemes: Theme[] = themes.map((t: any) => ({
      id: t.id || `custom-${Date.now()}`,
      name: t.name,
      definition: t.definition,
      closenessThreshold: typeof t.closenessThreshold === 'number' ? t.closenessThreshold : 0.6,
      keywords: Array.isArray(t.keywords) ? t.keywords : [],
    }));

    // Perform synthesis
    const result = await synthesizeNotes(notes, validatedThemes, quotesPerTheme);

    return NextResponse.json(result);
  } catch (error) {
    console.error('Error in synthesize endpoint:', error);
    const errorMessage = error instanceof Error ? error.message : 'Internal server error';
    return NextResponse.json(
      { error: errorMessage },
      { status: 500 }
    );
  }
}
