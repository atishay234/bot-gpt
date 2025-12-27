const Conversation = require("../models/Conversation");
const Message = require("../models/Message");
const { CONTEXT_LIMIT } = require("../config/constants");

const { getLLMProvider } = require("./llm");
const { buildContext } = require("./context-builder.service");

const llm = getLLMProvider();

async function createConversation(userId, firstMessage) {
  const conversation = await Conversation.create({
    userId,
  });

  await Message.create({
    conversationId: conversation._id,
    role: "user",
    content: firstMessage,
  });

  const history = await Message.find({ conversationId: conversation._id })
    .sort({ createdAt: -1 })
    .limit(CONTEXT_LIMIT);

  const context = buildContext(history.reverse());

  const reply = await llm.generateResponse(context);

  await Message.create({
    conversationId: conversation._id,
    role: "assistant",
    content: reply,
  });

  return {
    conversationId: conversation._id,
    reply,
  };
}

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

  await Message.create({
    conversationId: conversation._id,
    role: "user",
    content: message,
  });

  const history = await Message.find({ conversationId: conversation._id })
    .sort({ createdAt: -1 })
    .limit(CONTEXT_LIMIT);

  const context = buildContext(history.reverse());

  const reply = await llm.generateResponse(context);

  await Message.create({
    conversationId: conversation._id,
    role: "assistant",
    content: reply,
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

  return {
    page,
    limit,
    total,
    conversations,
  };
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

  await Message.deleteMany({ conversationId: conversation._id });
  await Conversation.deleteOne({ _id: conversation._id });
}

module.exports = {
  createConversation,
  addMessage,
  listConversations,
  deleteConversation,
};
