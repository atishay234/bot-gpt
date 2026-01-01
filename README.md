# BOT GPT – Conversational Backend

A production-oriented conversational backend built using **Node.js**, **Express**, **MongoDB**, and **LLM APIs (Groq – Llama models)**.

This project demonstrates backend architecture, REST API design, conversation management, and cost-aware LLM integration for a multi-turn chat system.

---

## 🚀 Features

- Multi-turn conversational chat (Open Chat)
- Retrieval-Augmented Generation (RAG) support
- Conversation-scoped document grounding
- Rolling, boundary-based conversation summarization
- Sliding window context strategy
- Cost-aware LLM usage with controlled calls
- User-scoped conversations via middleware
- MongoDB persistence (messages, summaries, documents)
- Provider-agnostic LLM service design
- Stateless REST APIs
- Pagination for conversation listing

> **Note:** Authentication is assumed to be handled upstream and is intentionally out of scope.  
> User identity is passed via request headers.

---

## 🧱 Tech Stack

- Node.js + Express
- MongoDB (Mongoose)
- Groq API (Llama models)
- Ollama (local) – Embedding generation
- JavaScript (no TypeScript)

---

## ⚙️ Setup & Run

### 1. Clone the repository

```bash
git clone https://github.com/<your-username>/bot-gpt-backend.git
cd bot-gpt-backend
```

### 2. Install dependencies

```bash
npm install
```

### 3. Environment variables

Create a `.env` file in the root directory:

```env
PORT=3000
MONGO_URI=<your_mongodb_connection_string>
GROQ_API_KEY=<your_groq_api_key>
```

> **Note:** Ollama must be running locally for embedding generation when using RAG.

### 4. Start the server

```bash
npm start
```

Server will start at:

```
http://localhost:3000
```

---

## 🔑 User Context Requirement

All API requests **must include a user identifier** in headers:

```http
x-user-id: <user_id>
```

Requests without a valid user context will be rejected.

---

## 📡 API Usage

### 1️⃣ Create a New Conversation (Open or RAG)

## a. Creates a new conversation.

## b. If documents are provided, the conversation starts in RAG mode.

**POST** `/conversations`

**Request Body**

```json
{
  "firstMessage": "Hello, how does Node.js work?",
  "documents": [
    "Node.js uses an event-driven, non-blocking I/O model.",
    "The event loop handles asynchronous callbacks."
  ]
}
```

**Response**

```json
{
  "conversationId": "64f8...",
  "reply": "Node.js is a JavaScript runtime built on..."
}
```

---

### 2️⃣ Add Message to an Existing Conversation

**POST** `/conversations/:id/messages`

**Request Body**

```json
{
  "message": "Can you explain how timers work?",
  "documents": [
    "Timers in Node.js are handled by the timers phase of the event loop."
  ]
}
```

**Response**

```json
{
  "reply": "Timers are processed in the timers phase of the event loop..."
}
```

---

### 3️⃣ List Conversations (Paginated)

**GET** `/conversations?page=1&limit=10`

**Response**

```json
{
  "page": 1,
  "limit": 10,
  "total": 25,
  "conversations": [
    {
      "_id": "64f8...",
      "createdAt": "2025-01-01T10:30:00Z"
    }
  ]
}
```

---

### 4️⃣ Delete a Conversation

**DELETE** `/conversations/:id`

**Response**

```json
{
  "message": "Conversation deleted"
}
```

---

### 5️⃣ Create User (Temporary / Testing Only)

**POST** `/users`

This endpoint is provided **only to create temporary users for testing purposes**.  
Authentication is assumed to be handled upstream and is intentionally out of scope.

**Request Body**

```json
{
  "name": "Atishay Jain"
}
```

**Response**

```json
{
  "userId": "1234"
}
```

---

## 🧠 Context & Cost Management

-Context is dynamically constructed per request using:

     -System prompt
     -Conversation summary (optional)
     -Recent messages (sliding window)
     -Retrieved document chunks (RAG, optional)

-Sliding window limits recent messages sent to the LLM
-Boundary-based summarization compresses older conversation history
-Messages are summarized once and never reprocessed
-Summaries are persisted at the conversation level
-LLM calls are minimized and predictable
-Reply generation and summarization are intentionally separated to avoid hallucinations

---

## 📦 RAG (Retrieval-Augmented Generation)

-Documents are scoped per conversation
-Documents are chunked and embedded using Ollama (local embeddings)
-Top-K relevant chunks are retrieved via vector similarity
-Retrieved chunks are injected into LLM context
-RAG is enabled automatically when documents are provided

---

## 🧪 Testing

APIs can be tested using:

- Postman
- curl
- REST Client extensions

Example curl request:

```bash
curl -X POST http://localhost:3000/conversations \
  -H "Content-Type: application/json" \
  -H "x-user-id: test-user" \
  -d '{"firstMessage":"Hello"}'
```

---

## 📄 Notes

- Frontend/UI is intentionally excluded
- Authentication & authorization are out of scope
- Focus is on backend architecture and LLM integration

---

## ✅ Submission Scope

This repository includes:

-Backend implementation
-REST APIs
-Conversation & message persistence
-Rolling summary mechanism
-RAG integration with embeddings
-Cost-aware LLM context management
-Scalable and extensible service design

Design documentation and future extensions are provided separately.
