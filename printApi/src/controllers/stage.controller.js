const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// Create a Stage
exports.createStage = async (req, res) => {
  try {
    const { title, color, days, workflowId,createdBy } = req.body;

    if (!title || !color || typeof days !== 'number') {
      return res.status(400).json({ message: "Title, color, and days are required" });
    }

    const stage = await prisma.stage.create({
      data: {
        title,
        color,
        days,
        workflowId: workflowId || null,
        createdBy
      }
    });

    res.status(201).json(stage);
  } catch (error) {
    console.error("Create Stage Error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Get All Stages
exports.getAllStages = async (req, res) => {
  try {
    const stages = await prisma.stage.findMany({
      include: {
        workflow: true
      }
    });

    res.json(stages);
  } catch (error) {
    console.error("Get Stages Error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Get Stage by ID
exports.getStageById = async (req, res) => {
  const { id } = req.params;

  try {
    const stage = await prisma.stage.findUnique({
      where: { id: parseInt(id) },
      include: {
        workflow: true
      }
    });

    if (!stage) {
      return res.status(404).json({ message: "Stage not found" });
    }

    res.json(stage);
  } catch (error) {
    console.error("Get Stage Error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Update Stage
exports.updateStage = async (req, res) => {
  const { id } = req.params;
  const { title, color, days, workflowId,updatedBy } = req.body;

  try {
    const updatedStage = await prisma.stage.update({
      where: { id: parseInt(id) },
      data: {
        title,
        color,
        days,
        workflowId: workflowId || null,
        updatedBy
      }
    });

    res.json(updatedStage);
  } catch (error) {
    console.error("Update Stage Error:", error);
    if (error.code === 'P2025') {
      return res.status(404).json({ message: "Stage not found" });
    }
    res.status(500).json({ message: "Internal server error" });
  }
};

// Delete Stage
exports.deleteStage = async (req, res) => {
  const { id } = req.params;

  try {
    await prisma.stage.delete({
      where: { id: parseInt(id) }
    });

    res.json({ message: "Stage deleted successfully" });
  } catch (error) {
    console.error("Delete Stage Error:", error);
    if (error.code === 'P2025') {
      return res.status(404).json({ message: "Stage not found" });
    }
    res.status(500).json({ message: "Internal server error" });
  }
};
