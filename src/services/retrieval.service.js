const { embedText } = require("../embeddings/ollama.embedder");

/**
 * Compute cosine similarity between two vectors
 */
function cosineSimilarity(vecA, vecB) {
  if (vecA.length !== vecB.length) return 0;

  let dot = 0;
  let normA = 0;
  let normB = 0;

  for (let i = 0; i < vecA.length; i++) {
    dot += vecA[i] * vecB[i];
    normA += vecA[i] * vecA[i];
    normB += vecB[i] * vecB[i];
  }

  if (normA === 0 || normB === 0) return 0;

  return dot / (Math.sqrt(normA) * Math.sqrt(normB));
}

/**
 * Retrieve top-K relevant document chunks for a query
 *
 * @param {string} query - user message
 * @param {Array<{ text: string, embedding: number[] }>} chunks
 * @param {number} k
 */
async function retrieveTopK({ query, chunks, k = 5 }) {
  if (!query || !Array.isArray(chunks) || chunks.length === 0) {
    return [];
  }

  // 1. Embed query
  const queryEmbedding = await embedText(query);

  // 2. Score all chunks
  const scored = chunks.map((chunk) => ({
    text: chunk.text,
    score: cosineSimilarity(queryEmbedding, chunk.embedding),
  }));

  // 3. Sort by relevance
  scored.sort((a, b) => b.score - a.score);

  // 4. Pick top-K (ignore near-zero noise)
  return scored
    .filter((c) => c.score > 0.05)
    .slice(0, k)
    .map((c) => c.text);
}

module.exports = {
  retrieveTopK,
};
