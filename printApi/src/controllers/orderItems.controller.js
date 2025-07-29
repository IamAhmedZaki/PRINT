const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const createOrderItem = async (req, res) => {
  try {
    const {
      orderId,
      productId,
      color,
      quantity,
      price,
      createdBy,
      sizeQuantities, // [{ size: 'M', quantity: 3 }, ...]
    } = req.body;

    // Basic validation
    if (!orderId || !productId || !quantity || !price) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    // Create the order item
    const orderItem = await prisma.orderItem.create({
      data: {
        orderId,
        productId,
        color,
        quantity,
        price,
        createdBy,
        sizeQuantities: {
          create: sizeQuantities?.map(sq => ({
            size: sq.size,
            quantity: sq.quantity,
          })) || [],
        },
      },
      include: {
        sizeQuantities: true,
      },
    });

//     const addOrderIntoActivityLog=await prisma.activityLog.create({
//   data: {
//     orderItemId:orderId,
    
//     action: `OrderFile Uploaded By"`,
//     performedBy: createdBy
//   }
// });

    res.status(201).json(orderItem);
  } catch (error) {
    console.error('Create OrderItem Error:', error);
    res.status(500).json({ message: 'Internal Server Error', error: error.message });
  }
};




const updateOrderItem = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      orderId,
      productId,
      color,
      quantity,
      price,
      updatedBy,
      sizeQuantities, // Optional: new list of sizes to replace
    } = req.body;

    const existingOrderItem = await prisma.orderItem.findUnique({
      where: { id: parseInt(id) },
      include: { sizeQuantities: true },
    });

    if (!existingOrderItem) {
      return res.status(404).json({ message: 'OrderItem not found' });
    }

    // Update main order item fields
    const updatedOrderItem = await prisma.orderItem.update({
      where: { id: parseInt(id) },
      data: {
        orderId,
        productId,
        color,
        quantity,
        price,
        updatedBy,
      },
    });

    // Optionally update sizeQuantities
    if (Array.isArray(sizeQuantities)) {
      // Delete old sizeQuantities
      await prisma.sizeQuantities.deleteMany({
        where: { orderItemId: parseInt(id) },
      });

      // Create new sizeQuantities
      await prisma.sizeQuantities.createMany({
        data: sizeQuantities.map(sq => ({
          orderItemId: parseInt(id),
          size: sq.size,
          quantity: sq.quantity,
        })),
      });
    }

    const result = await prisma.orderItem.findUnique({
      where: { id: parseInt(id) },
      include: { sizeQuantities: true },
    });

    res.status(200).json(result);
  } catch (error) {
    console.error('Update OrderItem Error:', error);
    res.status(500).json({ message: 'Internal Server Error', error: error.message });
  }
};



const getSingleOrderItem = async (req, res) => {
  try {
    const { id } = req.params;

    const orderItem = await prisma.orderItem.findUnique({
      where: { id: parseInt(id) },

      include: {
        sizeQuantities: true,
        product: true,
        order: true,
        comments: true,

      },
    });

    if (!orderItem) {
      return res.status(404).json({ message: 'OrderItem not found' });
    }

    res.status(200).json(orderItem);
  } catch (error) {
    console.error('Get OrderItem Error:', error);
    res.status(500).json({ message: 'Internal Server Error', error: error.message });
  }
};


const deleteOrderItem = async (req, res) => {
  try {
    const { id } = req.params;

    // Optional: Check if it exists
    const existingItem = await prisma.orderItem.findUnique({
      where: { id: parseInt(id) },
    });

    if (!existingItem) {
      return res.status(404).json({ message: 'OrderItem not found' });
    }

    // Delete related sizeQuantities (if needed)
    await prisma.sizeQuantities.deleteMany({
      where: { orderItemId: parseInt(id) },
    });

    // Delete the OrderItem
    await prisma.orderItem.delete({
      where: { id: parseInt(id) },
    });

    res.status(200).json({ message: 'OrderItem deleted successfully' });
  } catch (error) {
    console.error('Delete OrderItem Error:', error);
    res.status(500).json({ message: 'Internal Server Error', error: error.message });
  }
};

const getStagesByOrderItemId = async (req, res) => {
  try {
    const { orderItemId } = req.params;

    const orderItem = await prisma.orderItem.findUnique({
      where: { id: parseInt(orderItemId) },
      include: {
        product: {
          include: {
            service: {
              include: {
                workflow: {
                  include: {
                    stages: true,
                  },
                },
              },
            },
          },
        },
      },
    });

    if (!orderItem) {
      return res.status(404).json({ message: 'Order item not found' });
    }

    const stages = orderItem.product?.service?.workflow?.stages || [];

    res.status(200).json({ stages });
  } catch (error) {
    console.error('Get Stages Error:', error);
    res.status(500).json({ message: 'Internal Server Error', error: error.message });
  }
};


module.exports = {
     createOrderItem,getSingleOrderItem,updateOrderItem,deleteOrderItem,getStagesByOrderItemId                                                                               
};