const SYSTEM_PROMPT = "You are a helpful assistant.";

function buildReplyContext({ summary = "", recentMessages = [] }) {
  const context = [{ role: "system", content: SYSTEM_PROMPT }];

  if (summary) {
    context.push({
      role: "system",
      content: `Conversation summary:\n${summary}`,
    });
  }

  recentMessages.forEach((m) => {
    context.push({ role: m.role, content: m.content });
  });

  return context;
}

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
