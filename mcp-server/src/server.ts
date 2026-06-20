import Anthropic from '@anthropic-ai/sdk';

// Initialize Claude client
const client = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

interface Theme {
  name: string;
  definition: string;
  quotes: string[];
  severity: 'critical' | 'important' | 'nice-to-have' | 'note related to study';
}

interface SynthesisResult {
  themes: Theme[];
}

/**
 * Main synthesis function
 * Takes raw interview notes and returns structured themes with quotes and severity
 */
export async function synthesizeNotes(notes: string): Promise<SynthesisResult> {
  console.error('[MCP] Synthesizing notes, length:', notes.length);

  const systemPrompt = `You are an expert UX researcher helping to synthesize interview findings.

Your task is to analyze raw interview notes and extract:
1. Distinct themes or patterns
2. Clear definitions for each theme
3. Representative quotes that illustrate each theme
4. Severity rating (critical/important/nice-to-have/note related to study)

Be concise. Focus on real user needs and pain points, not solutions.
Extract 3-7 themes maximum.`;

  const userPrompt = `Please analyze these interview notes and extract thematic insights:

${notes}

Structure your response as JSON with this schema:
{
  "themes": [
    {
      "name": "Theme name",
      "definition": "What this theme means",
      "quotes": ["Quote 1", "Quote 2"],
      "severity": "critical|important|nice-to-have|note related to study"
    }
  ]
}`;

  try {
    const message = await client.messages.create({
      model: 'claude-3-5-sonnet-20241022',
      max_tokens: 2048,
      system: systemPrompt,
      messages: [
        {
          role: 'user',
          content: userPrompt,
        },
      ],
    });

    // Extract the text content from the response
    const textContent = message.content.find((block) => block.type === 'text');
    if (!textContent || textContent.type !== 'text') {
      throw new Error('No text response from Claude');
    }

    // Parse the JSON response
    let result: SynthesisResult;
    try {
      // Try to extract JSON from the response (it might be wrapped in markdown)
      const jsonMatch = textContent.text.match(/\{[\s\S]*\}/);
      if (!jsonMatch) {
        throw new Error('No JSON found in response');
      }
      result = JSON.parse(jsonMatch[0]);
    } catch (parseError) {
      console.error('[MCP] Failed to parse response:', textContent.text);
      throw new Error('Failed to parse Claude response as JSON');
    }

    return result;
  } catch (error) {
    console.error('[MCP] Synthesis error:', error);
    throw error;
  }
}

// Example usage / test
if (process.argv[1] === new URL(import.meta.url).pathname) {
  const testNotes = `
    Interview 1: The user said they struggle to keep track of all their notes.
    They currently use a spreadsheet but find it hard to organize themes.
    They mentioned spending 3-4 hours organizing notes for 8 interviews.

    Interview 2: Similar pain point — wants a faster way to extract insights.
    They use Notion but it feels clunky. Would love something purpose-built.

    Interview 3: Emphasized the need for shareable outputs.
    Wants to send findings to stakeholders without a lot of manual formatting.
  `;

  synthesizeNotes(testNotes)
    .then((result) => {
      console.log('Synthesis result:');
      console.log(JSON.stringify(result, null, 2));
    })
    .catch((error) => {
      console.error('Error:', error.message);
      process.exit(1);
    });
}
