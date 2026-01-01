const express = require("express");
const router = express.Router();

const resolveUser = require("../middlewares/resolveUser");
const { uploadDocument } = require("../services/document.service");

router.use(resolveUser);

/**
 * Upload document text for a conversation (RAG)
 */
router.post("/", async (req, res) => {
  const { conversationId, text } = req.body;

  if (!conversationId || !text) {
    return res.status(400).json({
      error: "conversationId and text are required",
    });
  }

  try {
    const result = await uploadDocument({ conversationId, text });
    res.status(201).json(result);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
