const GroqProvider = require("./groq.provider");

function getLLMProvider() {
  const provider = process.env.LLM_PROVIDER || "groq";

  switch (provider) {
    case "groq":
      return new GroqProvider();
    default:
      throw new Error(`Unsupported LLM provider: ${provider}`);
  }
}

module.exports = {
  getLLMProvider,
};
