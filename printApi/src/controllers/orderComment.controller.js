const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// CREATE
exports.createComment = async (req, res) => {
  try {
    const {
      orderId,
      orderItemId,
      commentText,
      commentBy,
      parentCommentId,
      is_internal,
    } = req.body;

    if (!commentText) {
      return res.status(400).json({ message: "Comment text is required." });
    }

    const newComment = await prisma.orderComment.create({
      data: {
        orderId,
        orderItemId,
        commentText,
        commentBy,
        parentCommentId,
        is_internal,
      },
    });

    res.status(201).json(newComment);
  } catch (error) {
    console.error("Create Comment Error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// GET ALL
exports.getAllComments = async (req, res) => {
  try {
    const comments = await prisma.orderComment.findMany({
      include: {
        replies: true,
        parentComment: true,
      },
    });

    res.json(comments);
  } catch (error) {
    console.error("Fetch Comments Error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// GET SINGLE
exports.getCommentById = async (req, res) => {
  try {
    const { id } = req.params;

    const comment = await prisma.orderComment.findUnique({
      where: { id: parseInt(id) },
      include: {
        replies: true,
        parentComment: true,
      },
    });

    if (!comment) return res.status(404).json({ message: "Comment not found" });

    res.json(comment);
  } catch (error) {
    console.error("Fetch Single Comment Error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// UPDATE
exports.updateComment = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      commentText,
      is_internal,
    } = req.body;

    const updatedComment = await prisma.orderComment.update({
      where: { id: parseInt(id) },
      data: {
        commentText,
        is_internal,
        updatedAt: new Date(),
      },
    });

    res.json(updatedComment);
  } catch (error) {
    console.error("Update Comment Error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// DELETE
exports.deleteComment = async (req, res) => {
  try {
    const { id } = req.params;

    await prisma.orderComment.delete({
      where: { id: parseInt(id) },
    });

    res.json({ message: "Comment deleted" });
  } catch (error) {
    console.error("Delete Comment Error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
