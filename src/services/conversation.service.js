const Conversation = require("../models/Conversation");
const Message = require("../models/Message");
const { CONTEXT_LIMIT } = require("../config/constants");

const { getLLMProvider } = require("./llm");
const {
  buildReplyContext,
  buildSummaryContext,
} = require("./context-builder.service");

const llm = getLLMProvider();

/**
 * Create a new conversation
 */
async function createConversation(userId, firstMessage) {
  const conversation = await Conversation.create({ userId });

  await Message.create({
    conversationId: conversation._id,
    role: "user",
    content: firstMessage,
    isSummarized: false,
  });

  const replyContext = buildReplyContext({
    recentMessages: [{ role: "user", content: firstMessage }],
  });

  const reply = await llm.generateResponse(replyContext);

  await Message.create({
    conversationId: conversation._id,
    role: "assistant",
    content: reply,
    isSummarized: false,
  });

  return { conversationId: conversation._id, reply };
}

/**
 * Add message + boundary summarisation
 */
async function addMessage(userId, conversationId, message) {
  const conversation = await Conversation.findOne({
    _id: conversationId,
    userId,
  });

  if (!conversation) {
    const error = new Error("Conversation not found");
    error.statusCode = 404;
    throw error;
  }

  const unsummarized = await Message.find({
    conversationId,
    isSummarized: false,
  }).sort({ createdAt: 1 });

  if (unsummarized.length > CONTEXT_LIMIT) {
    const messagesToSummarize = unsummarized.slice(
      0,
      unsummarized.length - CONTEXT_LIMIT
    );

    console.log(messagesToSummarize);

    const summaryContext = buildSummaryContext({
      summary: conversation.summary,
      messagesToSummarize,
    });

    const updatedSummary = await llm.generateResponse(summaryContext);

    conversation.summary = updatedSummary;
    await conversation.save();

    await Message.updateMany(
      { _id: { $in: messagesToSummarize.map((m) => m._id) } },
      { $set: { isSummarized: true } }
    );
  }

  // 1. Save user message
  await Message.create({
    conversationId,
    role: "user",
    content: message,
    isSummarized: false,
  });

  const recentMessages = await Message.find({
    conversationId,
  })
    .sort({ createdAt: -1 })
    .limit(CONTEXT_LIMIT);

  const replyContext = buildReplyContext({
    summary: conversation.summary,
    recentMessages: recentMessages.reverse(),
  });

  const reply = await llm.generateResponse(replyContext);

  await Message.create({
    conversationId,
    role: "assistant",
    content: reply,
    isSummarized: false,
  });

  return { reply };
}

async function listConversations(userId, page, limit) {
  const skip = (page - 1) * limit;

  const conversations = await Conversation.find({ userId })
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit);

  const total = await Conversation.countDocuments({ userId });

  return { page, limit, total, conversations };
}

async function deleteConversation(userId, conversationId) {
  const conversation = await Conversation.findOne({
    _id: conversationId,
    userId,
  });

  if (!conversation) {
    const error = new Error("Conversation not found");
    error.statusCode = 404;
    throw error;
  }

  await Message.deleteMany({ conversationId });
  await Conversation.deleteOne({ _id: conversationId });
}

module.exports = {
  createConversation,
  addMessage,
  listConversations,
  deleteConversation,
};
