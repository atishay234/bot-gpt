const express = require("express");
const router = express.Router();

const resolveUser = require("../middlewares/resolveUser");
const conversationService = require("../services/conversation.service");

router.use(resolveUser);

/**
 * Create new conversation
 * Supports:
 * - Open chat (firstMessage only)
 * - RAG-first chat (firstMessage + documents[])
 */
router.post("/", async (req, res) => {
  const { firstMessage, documents } = req.body;

  if (!firstMessage) {
    return res.status(400).json({ error: "firstMessage is required" });
  }

  if (documents && !Array.isArray(documents)) {
    return res.status(400).json({
      error: "documents must be an array of strings",
    });
  }

  try {
    const result = await conversationService.createConversation({
      userId: req.user._id,
      firstMessage,
      documents,
    });

    res.status(201).json(result);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/**
 * Add message to existing conversation (no documents here)
 */
router.post("/:id/messages", async (req, res) => {
  const { message, documents } = req.body;

  if (!message) {
    return res.status(400).json({ error: "message is required" });
  }

  if (documents && !Array.isArray(documents)) {
    return res.status(400).json({
      error: "documents must be an array of strings",
    });
  }

  try {
    const result = await conversationService.addMessage(
      req.params.id,
      message,
      documents
    );

    res.status(200).json(result);
  } catch (err) {
    res.status(err.statusCode || 500).json({ error: err.message });
  }
});

/**
 * List conversations
 */
router.get("/", async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;

  const result = await conversationService.listConversations(
    req.user._id,
    page,
    limit
  );

  res.status(200).json(result);
});

/**
 * Delete conversation
 */
router.delete("/:id", async (req, res) => {
  try {
    await conversationService.deleteConversation(req.user._id, req.params.id);
    res.status(200).json({ message: "Conversation deleted" });
  } catch (err) {
    res.status(err.statusCode || 500).json({ error: err.message });
  }
});

module.exports = router;
