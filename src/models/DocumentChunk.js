const mongoose = require("mongoose");

const documentChunkSchema = new mongoose.Schema(
  {
    conversationId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Conversation",
      required: true,
      index: true,
    },

    text: {
      type: String,
      required: true,
    },

    embedding: {
      type: [Number],
      required: true,
    },
  },
  { timestamps: true }
);

// Helpful compound index for retrieval later
documentChunkSchema.index({ conversationId: 1 });

module.exports = mongoose.model("DocumentChunk", documentChunkSchema);
