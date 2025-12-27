const SYSTEM_PROMPT = "You are a helpful assistant.";

function buildContext(messages, limit = 10) {
  const recentMessages = messages.slice(-limit);

  return [
    { role: "system", content: SYSTEM_PROMPT },
    ...recentMessages.map((m) => ({
      role: m.role,
      content: m.content,
    })),
  ];
}

module.exports = {
  buildContext,
};
