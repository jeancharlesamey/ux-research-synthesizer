# UX Research Synthesizer — MCP Server

TypeScript MCP server that handles interview note synthesis using Claude's API.

## What it does

- Accepts raw interview notes as input
- Calls Claude 3.5 Sonnet with a synthesis prompt
- Returns structured themes, quotes, and severity ratings as JSON

## Running the server

### Development

```bash
npm install
npm run dev
```

The server will watch for changes and restart automatically.

### Production

```bash
npm install
npm run build
npm run start
```

## Environment

Create a `.env` file or set `ANTHROPIC_API_KEY` in your shell:

```
ANTHROPIC_API_KEY=sk-ant-...
```

## API

### `synthesizeNotes(notes: string): Promise<SynthesisResult>`

Takes interview notes as a string and returns structured themes.

**Input:**
```typescript
const notes = "Interview 1: ... Interview 2: ...";
```

**Output:**
```typescript
{
  "themes": [
    {
      "name": "User Pain Point A",
      "definition": "Users struggle with X because Y",
      "quotes": ["Quote from interview", "Another quote"],
      "severity": "critical"
    }
  ]
}
```

**Severity levels:** `critical`, `important`, `nice-to-have`

## Testing

Run the server directly to test with example notes:

```bash
npm run dev
# The server includes test data at the bottom of server.ts
```

## Architecture

The server is invoked by the Next.js app's `/api/synthesize` endpoint. The flow is:

1. Next.js API route receives notes
2. Spawns or calls the MCP server (stdio)
3. Server calls Claude with structured prompt
4. Returns JSON result
5. Next.js returns result to frontend

No persistent state. Each call is stateless.
