const express = require("express");
require("dotenv").config();

const connectDB = require("./config/db");
const conversationRoutes = require("./routes/conversations");

const app = express();
app.use(express.json());

connectDB();

app.get("/health", (req, res) => {
  res.status(200).json({ status: "ok" });
});

app.use("/conversations", conversationRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
