// Function calling schemas for Claude API

export const extractThemesSchema = {
  name: 'extract_themes',
  description: 'Extract distinct themes from interview notes',
  input_schema: {
    type: 'object' as const,
    properties: {
      themes: {
        type: 'array',
        items: {
          type: 'object',
          properties: {
            name: {
              type: 'string',
              description: 'Short theme name (2-4 words)',
            },
            definition: {
              type: 'string',
              description: 'Clear definition of the theme',
            },
            quotes: {
              type: 'array',
              items: { type: 'string' },
              description: 'Representative quotes from interviews',
            },
            severity: {
              type: 'string',
              enum: ['critical', 'important', 'nice-to-have'],
              description: 'How critical is this issue',
            },
          },
          required: ['name', 'definition', 'quotes', 'severity'],
        },
      },
    },
    required: ['themes'],
  },
};

export type Theme = {
  name: string;
  definition: string;
  quotes: string[];
  severity: 'critical' | 'important' | 'nice-to-have';
};

export type ExtractThemesInput = {
  themes: Theme[];
};
