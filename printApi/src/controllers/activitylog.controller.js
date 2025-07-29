const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// GET logs by orderId
exports.getLogsByOrderId = async (req, res) => {
  const { orderId } = req.params;
  try {
    const logs = await prisma.activityLog.findMany({
      where: { orderId: parseInt(orderId) },
      include: {
        order: true,
        orderItem: true,
        product: true,
      },
    });
    res.json(logs);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch activity logs by orderId', detail: error.message });
  }
};

// GET logs by orderItemId
exports.getLogsByOrderItemId = async (req, res) => {
  const { orderItemId } = req.params;
  try {
    const logs = await prisma.activityLog.findMany({
      where: { orderItemId: parseInt(orderItemId) },
      include: {
        order: true,
        orderItem: true,
        product: true,
      },
    });
    res.json(logs);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch activity logs by orderItemId', detail: error.message });
  }
};
