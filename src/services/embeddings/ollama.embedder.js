const axios = require("axios");

const OLLAMA_URL = "http://localhost:11434/api/embeddings";
const EMBEDDING_MODEL = "nomic-embed-text";

/**
 * Generate embedding using Ollama (local, free)
 */
async function embedText(text) {
  if (!text || typeof text !== "string") {
    throw new Error("Invalid text for embedding");
  }

  const response = await axios.post(OLLAMA_URL, {
    model: EMBEDDING_MODEL,
    prompt: text,
  });

  const embedding = response?.data?.embedding;

  if (!Array.isArray(embedding)) {
    throw new Error("Invalid embedding response from Ollama");
  }

  return embedding;
}

module.exports = {
  embedText,
};
