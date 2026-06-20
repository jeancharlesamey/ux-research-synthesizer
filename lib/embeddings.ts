// Local embeddings using @xenova/transformers
// Runs on server (Next.js API route) or in browser with WASM

let pipelineCache: any = null;

/**
 * Initialize the embedding model (lazy-load, cached after first use)
 */
export async function initializeEmbeddings() {
  if (pipelineCache) return pipelineCache;

  try {
    const { pipeline } = await import('@xenova/transformers');
    // Use a lightweight model suitable for sentence embeddings
    pipelineCache = await pipeline('feature-extraction', 'Xenova/all-MiniLM-L6-v2');
    return pipelineCache;
  } catch (error) {
    console.error('Failed to initialize embeddings:', error);
    throw new Error('Could not load embedding model. Check your internet connection and try again.');
  }
}

export interface EmbeddingResult {
  text: string;
  embedding: number[];
}

/**
 * Embed a single text or array of texts
 */
export async function embedTexts(texts: string | string[]): Promise<EmbeddingResult | EmbeddingResult[]> {
  const pipeline = await initializeEmbeddings();
  const isArray = Array.isArray(texts);
  const textsToEmbed = isArray ? texts : [texts];

  try {
    const result = await pipeline(textsToEmbed, {
      pooling: 'mean',
      normalize: true,
    });

    console.log('[embeddings] Result type:', typeof result, 'Has data?', !!result?.data);

    // Convert Tensor output to plain arrays
    // result is a single Tensor with shape [batch_size, embedding_dim]
    let embeddings: number[][];

    if (result?.data) {
      // It's a Tensor object
      const data = Array.from(result.data);
      console.log('[embeddings] Data length:', data.length, 'Texts count:', textsToEmbed.length);
      const embeddingDim = data.length / textsToEmbed.length;
      embeddings = [];
      for (let i = 0; i < textsToEmbed.length; i++) {
        embeddings.push(data.slice(i * embeddingDim, (i + 1) * embeddingDim));
      }
      console.log('[embeddings] Generated', embeddings.length, 'embeddings');
    } else if (Array.isArray(result)) {
      // Already an array
      embeddings = result;
      console.log('[embeddings] Already array, length:', embeddings.length);
    } else {
      console.log('[embeddings] Result object:', Object.keys(result || {}));
      throw new Error(`Unexpected embedding format: ${typeof result}`);
    }

    const results = textsToEmbed.map((text, idx) => ({
      text,
      embedding: embeddings[idx] || [],
    }));

    return isArray ? results : results[0];
  } catch (error) {
    console.error('Error embedding texts:', error);
    throw new Error('Failed to generate embeddings.');
  }
}

/**
 * Compute cosine similarity between two vectors
 */
export function cosineSimilarity(vecA: number[], vecB: number[]): number {
  if (vecA.length !== vecB.length) throw new Error('Vectors must have same length');

  let dotProduct = 0;
  let normA = 0;
  let normB = 0;

  for (let i = 0; i < vecA.length; i++) {
    dotProduct += vecA[i] * vecB[i];
    normA += vecA[i] * vecA[i];
    normB += vecB[i] * vecB[i];
  }

  normA = Math.sqrt(normA);
  normB = Math.sqrt(normB);

  if (normA === 0 || normB === 0) return 0;
  return dotProduct / (normA * normB);
}

/**
 * Find top K similar texts from a corpus
 */
export async function findSimilarTexts(
  query: string,
  corpus: string[],
  k: number = 5
): Promise<Array<{ text: string; similarity: number; index: number }>> {
  // Embed query
  const queryResult = await embedTexts(query);
  const queryEmbedding = 'embedding' in queryResult ? queryResult.embedding : queryResult[0].embedding;

  // Embed corpus
  const corpusResults = await embedTexts(corpus);
  const corpusEmbeddings = Array.isArray(corpusResults) ? corpusResults : [corpusResults];

  // Compute similarities
  const similarities = corpusEmbeddings.map((result, idx) => ({
    text: corpus[idx],
    similarity: cosineSimilarity(queryEmbedding, result.embedding),
    index: idx,
  }));

  // Sort and return top K
  return similarities.sort((a, b) => b.similarity - a.similarity).slice(0, k);
}
