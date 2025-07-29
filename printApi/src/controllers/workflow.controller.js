const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// CREATE Workflow


exports.createWorkflow = async (req, res) => {
  try {
    const { title,createdBy} = req.body;

    if (!title) {
      return res.status(400).json({ message: "Title is required" });
    }

    

    const newWorkflow = await prisma.workflow.create({
      data: {
        title,
        createdBy
        
      }
    });

    res.status(201).json(newWorkflow);
  } catch (error) {
    console.error("Create Workflow with Stages Error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// GET all Workflows
exports.getAllWorkflows = async (req, res) => {
  try {
    const workflows = await prisma.workflow.findMany({
      include: {
        stages: true,
        services: true
      }
    });
    res.json(workflows);
  } catch (error) {
    console.error("Get Workflows Error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// GET a single Workflow by ID
exports.getWorkflowById = async (req, res) => {
  const { id } = req.params;

  try {
    const workflow = await prisma.workflow.findUnique({
      where: { id: parseInt(id) },
      include: {
        stages: true,
        services: true
      }
    });

    if (!workflow) {
      return res.status(404).json({ message: "Workflow not found" });
    }

    res.json(workflow);
  } catch (error) {
    console.error("Get Workflow Error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// UPDATE Workflow
exports.updateWorkflow = async (req, res) => {
  const { id } = req.params;
  const { title,updatedBy } = req.body;

  try {
    const updatedWorkflow = await prisma.workflow.update({
      where: { id: parseInt(id) },
      data: { title,updatedBy }
    });

    res.json(updatedWorkflow);
  } catch (error) {
    console.error("Update Workflow Error:", error);
    if (error.code === 'P2025') {
      return res.status(404).json({ message: "Workflow not found" });
    }
    res.status(500).json({ message: "Internal server error" });
  }
};

// DELETE Workflow
exports.deleteWorkflow = async (req, res) => {
  const { id } = req.params;

  try {
    await prisma.workflow.delete({
      where: { id: parseInt(id) }
    });

    res.json({ message: "Workflow deleted successfully" });
  } catch (error) {
    console.error("Delete Workflow Error:", error);
    if (error.code === 'P2025') {
      return res.status(404).json({ message: "Workflow not found" });
    }
    res.status(500).json({ message: "Internal server error" });
  }
};


exports.addStagesToWorkflow = async (req, res) => {
  const { id } = req.params;
 

  try {
    const {stages,createdBy } = req.body;
    if (!Array.isArray(stages) || stages.length === 0) {
      return res.status(400).json({ message: "At least one stage is required" });
    }

    // Validate each stage
    for (const stage of stages) {
      if (!stage.title || !stage.color || typeof stage.days !== 'number') {
        return res.status(400).json({ message: "Each stage must include title, color, and days" });
      }
    }
    const addStagesToWorkflow = await prisma.workflow.update({
      where: { id: parseInt(id) },
      data: {
        
        stages: {
          create: stages.map(stage => ({
            title: stage.title,
            color: stage.color,
            days: stage.days,
            createdBy:createdBy
          }))
        }
      },
      include: {
        stages: true
      }
    });

    res.json(addStagesToWorkflow);
  } catch (error) {
    console.error("Update Workflow Error:", error);
    if (error.code === 'P2025') {
      return res.status(404).json({ message: "Workflow not found" });
    }
    res.status(500).json({ message: "Internal server error" });
  }
};