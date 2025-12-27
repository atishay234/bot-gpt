const axios = require("axios");

class GroqProvider {
  constructor() {
    this.client = axios.create({
      baseURL: "https://api.groq.com/openai/v1",
      headers: {
        Authorization: `Bearer ${process.env.GROQ_API_KEY}`,
        "Content-Type": "application/json",
      },
    });
  }

  async generateResponse(messages) {
    try {
      const response = await this.client.post("/chat/completions", {
        model: "llama-3.1-8b-instant",
        messages,
        temperature: 0.7,
      });

      return response.data.choices[0].message.content;
    } catch (error) {
      console.error("Groq API error:", error.response?.data || error.message);
      throw new Error("Failed to generate LLM response");
    }
  }
}

module.exports = GroqProvider;
