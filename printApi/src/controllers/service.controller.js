const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// Create a Service
exports.createService = async (req, res) => {
  try {
    const { title, workflowId, createdBy } = req.body;

    if (!title) {
      return res.status(400).json({ message: 'Title is required' });
    }

    const newService = await prisma.service.create({
      data: {
        title,
        workflowId: workflowId || null,
        createdBy
      }
    });

    res.status(201).json(newService);
  } catch (error) {
    console.error("Create Service Error:", error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Get All Services
exports.getAllServices = async (req, res) => {
  try {
    const services = await prisma.service.findMany({
      include: {
        workflow: {
            include:{stages:true}
        },
        products: true,

      }
    });

    res.json(services);
  } catch (error) {
    console.error("Get All Services Error:", error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Get Service by ID
exports.getServiceById = async (req, res) => {
  const { id } = req.params;

  try {
    const service = await prisma.service.findUnique({
      where: { id: parseInt(id) },
      include: {
        workflow: true,
        products: true
      }
    });

    if (!service) {
      return res.status(404).json({ message: 'Service not found' });
    }

    res.json(service);
  } catch (error) {
    console.error("Get Service Error:", error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Update a Service
exports.updateService = async (req, res) => {
  const { id } = req.params;
  const { title, workflowId,updatedBy } = req.body;

  try {
    const updatedService = await prisma.service.update({
      where: { id: parseInt(id) },
      data: {
        title,
        workflowId: workflowId || null,
        updatedBy
      }
    });

    res.json(updatedService);
  } catch (error) {
    console.error("Update Service Error:", error);
    if (error.code === 'P2025') {
      return res.status(404).json({ message: 'Service not found' });
    }
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Delete a Service
exports.deleteService = async (req, res) => {
  const { id } = req.params;

  try {
    await prisma.service.delete({
      where: { id: parseInt(id) }
    });

    res.json({ message: 'Service deleted successfully' });
  } catch (error) {
    console.error("Delete Service Error:", error);
    if (error.code === 'P2025') {
      return res.status(404).json({ message: 'Service not found' });
    }
    res.status(500).json({ message: 'Internal server error' });
  }
};
