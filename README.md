# BOT GPT – Conversational Backend

A production-oriented conversational backend built using **Node.js**, **Express**, **MongoDB**, and **LLM APIs (Groq – Llama models)**.

This project demonstrates backend architecture, REST API design, conversation management, and cost-aware LLM integration for a multi-turn chat system.

---

## 🚀 Features

- Open Chat mode (multi-turn conversations)
- LLM integration via Groq (Llama models)
- Server-side conversation history management
- Sliding window context strategy
- Single LLM call per message for cost optimization
- User-scoped conversations via middleware
- MongoDB persistence
- Provider-agnostic LLM service design
- Pagination for conversation listing

> **Note:** Authentication is assumed to be handled upstream and is intentionally out of scope.  
> User identity is passed via request headers.

---

## 🧱 Tech Stack

- Node.js + Express  
- MongoDB (Mongoose)  
- Groq API (Llama models)  
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

### 1️⃣ Create a New Conversation

**POST** `/conversations`

**Request Body**
```json
{
  "firstMessage": "Hello, how does Node.js work?"
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
  "message": "Can you explain the event loop?"
}
```

**Response**
```json
{
  "reply": "The Node.js event loop is responsible for..."
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

- Only the most recent **N messages** are sent to the LLM (sliding window)
- Older messages can be summarized (design-supported)
- **Single LLM API call per user message** to minimize cost and latency
- System prompts are reused across requests

---

## 📦 RAG Support (Design Only)

The system is designed to support **Retrieval-Augmented Generation (RAG)** by injecting retrieved documents into the LLM context.

The following are intentionally **out of scope** for this submission:

- Document ingestion
- Embedding generation
- Vector database integration
- Fine-tuning or model training

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

- Backend implementation
- REST APIs
- Conversation & message persistence
- LLM integration
- Cost-aware context management

Design documentation and future extensions are provided separately.
