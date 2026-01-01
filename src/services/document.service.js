const DocumentChunk = require("../models/DocumentChunk");
const { embedText } = require("./embeddings/ollama.embedder");

const CHUNK_SIZE = 500;

/**
 * Split text into fixed-size chunks
 */
function chunkText(text) {
  const chunks = [];
  let start = 0;

  while (start < text.length) {
    chunks.push(text.slice(start, start + CHUNK_SIZE));
    start += CHUNK_SIZE;
  }

  return chunks;
}

/**
 * Upload document text for a conversation
 */
async function uploadDocument({ conversationId, text }) {
  if (!conversationId) {
    throw new Error("conversationId is required");
  }

  if (!text || typeof text !== "string") {
    throw new Error("Invalid document text");
  }

  const chunks = chunkText(text);

  const docs = [];

  for (const chunk of chunks) {
    const embedding = await embedText(chunk);

    docs.push({
      conversationId,
      text: chunk,
      embedding,
    });
  }

  await DocumentChunk.insertMany(docs);

  return {
    chunksCreated: docs.length,
  };
}

module.exports = {
  uploadDocument,
};
