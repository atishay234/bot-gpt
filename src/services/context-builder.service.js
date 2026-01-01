const SYSTEM_PROMPT = "You are a helpful assistant.";

/**
 * Build context for LLM reply
 * Supports:
 * - Open chat
 * - Summary-aware chat
 * - RAG (documents grounding)
 */
function buildReplyContext({
  summary = "",
  recentMessages = [],
  documents = [],
}) {
  const context = [
    {
      role: "system",
      content: SYSTEM_PROMPT,
    },
  ];

  if (documents && documents.length > 0) {
    context.push({
      role: "system",
      content:
        "You are given the following reference documents.\n" +
        "Use them as factual grounding when answering.\n" +
        "If the answer is not present, say you don't know.\n\n" +
        documents
          .map((doc, idx) => `Document ${idx + 1}:\n${doc}`)
          .join("\n\n"),
    });
  }

  if (summary) {
    context.push({
      role: "system",
      content: `Conversation summary:\n${summary}`,
    });
  }

  recentMessages.forEach((m) => {
    context.push({
      role: m.role,
      content: m.content,
    });
  });

  return context;
}

/**
 * Build context for summarisation
 */
function buildSummaryContext({ summary = "", messagesToSummarize = [] }) {
  const context = [
    {
      role: "system",
      content:
        "You are summarizing conversation history into persistent memory.\n" +
        "Preserve important factual details.\n" +
        "Append to the existing summary.\n" +
        "Return only the updated summary text.",
    },
  ];

  if (summary) {
    context.push({
      role: "system",
      content: `Existing summary:\n${summary}`,
    });
  }

  const text = messagesToSummarize
    .map((m) => `${m.role}: ${m.content}`)
    .join("\n");

  context.push({ role: "user", content: text });

  return context;
}

module.exports = {
  buildReplyContext,
  buildSummaryContext,
};
