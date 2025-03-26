const Session = require("../models/session.model");

const getAll = async (req, res) => {
  try {
    const session = await Session.findOne({
      where: { userId: req.user.id },
      order: [["createdAt", "DESC"]],
    });

    if (!session) {
      return res.status(404).json({ message: "Session not found!" });
    }

    res.status(200).json(session);
  } catch (error) {
    console.error("Error fetching session:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

const remove = async (req, res) => {
  try {
    const session = await Session.findOne({
      where: { userId: req.user.id },
      order: [["createdAt", "DESC"]],
    });

    if (!session) {
      return res.status(404).json({ message: "Session not found!" });
    }

    await session.destroy();
    res.status(200).json({ message: "Session deleted successfully" });
  } catch (error) {
    console.error("Error deleting session:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

module.exports = { getAll, remove };
