const express = require("express");
require("dotenv").config();
const conversationRoutes = require("./controllers/conversation.controller");
const userRoutes = require("./controllers/user.controller");
const documentController = require("./controllers/document.controller");

const connectDB = require("./config/db");

const app = express();
app.use(express.json());

connectDB();

app.get("/health", (req, res) => {
  res.status(200).json({ status: "ok" });
});

app.use("/conversations", conversationRoutes);
app.use("/users", userRoutes);
app.use("/documents", documentController);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
