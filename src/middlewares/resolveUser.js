const User = require("../models/User");

async function resolveUser(req, res, next) {
  const reqUserId = req.header("x-user-id");

  if (!reqUserId) {
    return res.status(401).json({
      error: "x-user-id header is required",
    });
  }

  try {
    const user = await User.findOne({ _id: reqUserId });

    if (!user) {
      return res.status(404).json({
        error: "User not found",
      });
    }

    req.user = user;
    next();
  } catch (err) {
    return res.status(500).json({
      error: "Failed to resolve user",
    });
  }
}

module.exports = resolveUser;
