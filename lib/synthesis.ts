// Core synthesis logic: theme matching, quote extraction, severity ranking

import { Theme } from './themes';
import { embedTexts, cosineSimilarity } from './embeddings';

export interface SynthesisResult {
  themes: Array<{
    name: string;
    definition: string;
    severity: 'critical' | 'important' | 'nice-to-have';
    quotes: Array<{
      text: string;
      similarity: number;
      keywordBoost: number;
    }>;
    quotesCount: number;
  }>;
  sentences: Array<{
    text: string;
    themeId?: string;
    themeName?: string;
    similarity?: number;
  }>;
}

/**
 * Split interview notes into sentences for extraction
 */
export function sentencize(text: string): string[] {
  // Remove interview headers (e.g., "**Interview 1 — Name**")
  let cleaned = text.replace(/\*\*Interview\s+\d+\s*—.*?\*\*/g, '');

  // Remove bold markdown formatting and question/interview labels
  cleaned = cleaned
    .replace(/\*\*.*?\*\*/g, '') // Remove **bold**
    .replace(/\*.*?\*/g, '') // Remove *italic*
    .replace(/^[""]/, '') // Remove opening quotes
    .trim();

  // Split on sentence boundaries: . ! ? followed by space or newline, or newline followed by quote
  const sentences = cleaned
    .split(/(?<=[.!?])\s+|(?<=[.!?])\n/)
    .filter((s) => {
      const trimmed = s.trim();
      // Filter out very short fragments and remaining headers
      return trimmed.length > 15 && !trimmed.match(/^interview|^interview\s+\d/i);
    })
    .map((s) => {
      // Clean up remaining quotes and trim
      return s
        .trim()
        .replace(/^[""]/, '') // Remove leading quotes
        .replace(/[""]$/, ''); // Remove trailing quotes
    })
    .filter((s) => s.length > 15); // Final filter

  return sentences;
}

/**
 * Detect severity keywords in a quote
 * Returns a boost factor 0-1
 */
export function detectKeywordSeverity(
  quote: string,
  keywords?: string[]
): { score: number; boost: number } {
  if (!keywords || keywords.length === 0) {
    return { score: 0, boost: 0 };
  }

  const lowerQuote = quote.toLowerCase();
  let boost = 0;

  for (const keyword of keywords) {
    if (lowerQuote.includes(keyword.toLowerCase())) {
      boost = Math.max(boost, 0.25); // Keyword present: +0.25 boost
    }
  }

  return { score: 0, boost };
}

/**
 * Extract quotes for a single theme
 */
export async function extractQuotesForTheme(
  theme: Theme,
  sentences: string[],
  topK: number = 999
): Promise<
  Array<{
    text: string;
    similarity: number;
    keywordBoost: number;
  }>
> {
  try {
    // Embed theme definition and all sentences
    const results = await embedTexts([theme.definition, ...sentences]);
    const themeDef = Array.isArray(results) ? results[0] : results;
    const sentenceEmbeddings = Array.isArray(results) ? results.slice(1) : [results];

    console.log(`[synthesis] Theme: "${theme.name}", threshold: ${theme.closenessThreshold}, sentences: ${sentences.length}`);

    // Compute similarity for each sentence
    const scored = sentences.map((sentence, idx) => {
      const similarity = cosineSimilarity(
        themeDef.embedding,
        sentenceEmbeddings[idx].embedding
      );

      const { boost: keywordBoost } = detectKeywordSeverity(sentence, theme.keywords);

      return {
        text: sentence,
        similarity,
        keywordBoost,
        finalScore: similarity + keywordBoost * 0.15, // Keyword boost worth ~15%
      };
    });

    const maxSim = Math.max(...scored.map(s => s.similarity));
    const minSim = Math.min(...scored.map(s => s.similarity));
    console.log(`[synthesis] Similarity range: ${minSim.toFixed(3)} - ${maxSim.toFixed(3)}`);

    // Filter by closeness threshold and get top K
    const filtered = scored
      .filter((s) => s.similarity >= theme.closenessThreshold)
      .sort((a, b) => b.finalScore - a.finalScore)
      .slice(0, topK);

    console.log(`[synthesis] Filtered: ${filtered.length} quotes pass threshold ${theme.closenessThreshold}`);

    return filtered.map(({ text, similarity, keywordBoost }) => ({
      text,
      similarity,
      keywordBoost,
    }));
  } catch (error) {
    console.error(`Error extracting quotes for theme "${theme.name}":`, error);
    return [];
  }
}

/**
 * Assign severity based on similarity and keyword frequency
 */
export function assignSeverity(
  similarity: number,
  keywordBoost: number,
  frequency: number // How many times this theme appears
): 'critical' | 'important' | 'nice-to-have' {
  const baseScore = similarity + keywordBoost * 0.15;
  const frequencyBoost = Math.min(frequency / 5, 0.1); // Cap frequency boost at 0.1

  const finalScore = baseScore + frequencyBoost;

  if (finalScore >= 0.75 || keywordBoost > 0) {
    return 'critical';
  } else if (finalScore >= 0.60) {
    return 'important';
  } else {
    return 'nice-to-have';
  }
}

/**
 * Main synthesis function: given notes and themes, extract structured findings
 */
export async function synthesizeNotes(
  notes: string,
  themes: Theme[],
  quotesPerTheme: number = 5
): Promise<SynthesisResult> {
  // Sentencize
  const sentences = sentencize(notes);

  if (sentences.length === 0) {
    throw new Error('No sentences found in notes. Make sure your notes are at least a few sentences long.');
  }

  // Extract quotes for each theme
  const themesWithQuotes = await Promise.all(
    themes.map(async (theme) => {
      const quotes = await extractQuotesForTheme(theme, sentences, quotesPerTheme);

      return {
        name: theme.name,
        definition: theme.definition,
        severity: assignSeverity(
          quotes[0]?.similarity ?? 0,
          quotes[0]?.keywordBoost ?? 0,
          quotes.length
        ),
        quotes,
        quotesCount: quotes.length,
      };
    })
  );

  // Filter out themes with no quotes
  const filteredThemes = themesWithQuotes.filter((t) => t.quotes.length > 0);

  // Build sentence-theme mapping
  const sentenceThemeMap = new Map<string, { themeId: string; themeName: string; similarity: number }>();

  for (const theme of themesWithQuotes) {
    for (const quote of theme.quotes) {
      // Find which sentence this quote corresponds to
      const sentenceIdx = sentences.findIndex(s => s === quote.text);
      if (sentenceIdx !== -1) {
        sentenceThemeMap.set(quote.text, {
          themeId: theme.name,
          themeName: theme.name,
          similarity: quote.similarity,
        });
      }
    }
  }

  // Map all sentences with their themes
  const sentencesWithThemes = sentences.map(sentence => {
    const mapping = sentenceThemeMap.get(sentence);
    return {
      text: sentence,
      themeId: mapping?.themeId,
      themeName: mapping?.themeName,
      similarity: mapping?.similarity,
    };
  });

  const result: SynthesisResult = {
    themes: filteredThemes,
    sentences: sentencesWithThemes,
  };

  return result;
}
