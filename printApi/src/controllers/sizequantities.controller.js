const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const createSizeQuantity = async (req, res) => {
  try {
    const { orderitemId, Size, Price, Quantity, createdBy } = req.body;

    if (!orderitemId || !Price || !Quantity) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    const sizeQuantity = await prisma.sizeQuantities.create({
      data: {
        orderitemId,
        Size,
        Price,
        Quantity,
        createdBy,
      },
    });

    const existingOrderItem = await prisma.orderItem.findFirst({
      where: { id: parseInt(orderitemId) }
      
    });

    const existingOrderItemQuantity=(existingOrderItem.quantity)+Quantity
    const existingOrderItemPrice=(existingOrderItem.price)+(Price*Quantity)



    const updatedOrderItem = await prisma.orderItem.update({
      where: { id: parseInt(orderitemId) },
      data: {
        
        quantity:existingOrderItemQuantity,
        price:existingOrderItemPrice,
        
      },
    });

    const addOrderIntoActivityLog=await prisma.activityLog.create({
  data: {
    orderItemId:orderitemId,
    
    action: "Size and Quantity Created By",
    performedBy: createdBy
  }
});

    res.status(201).json(sizeQuantity);
  } catch (error) {
    console.error('Create SizeQuantity Error:', error);
    res.status(500).json({ message: 'Internal Server Error', error: error.message });
  }
};


const getSingleSizeQuantity = async (req, res) => {
  try {
    const { id } = req.params;

    const sizeQuantity = await prisma.sizeQuantities.findUnique({
      where: { id: parseInt(id) },
      include: {
        orderitem: true,
      },
    });

    if (!sizeQuantity) {
      return res.status(404).json({ message: 'SizeQuantity not found' });
    }

    res.status(200).json(sizeQuantity);
  } catch (error) {
    console.error('Get SizeQuantity Error:', error);
    res.status(500).json({ message: 'Internal Server Error', error: error.message });
  }
};


const updateSizeQuantity = async (req, res) => {
  try {
    const { id } = req.params;
    const { Size, Price, Quantity, updatedBy } = req.body;

    const existing = await prisma.sizeQuantities.findUnique({
      where: { id: parseInt(id) },
    });

    if (!existing) {
      return res.status(404).json({ message: 'SizeQuantity not found' });
    }

    
    
    
    const updated = await prisma.sizeQuantities.update({
      where: { id: parseInt(id) },
      data: {
        Size,
        Price,
        Quantity,
        updatedBy,
      },
    });

     const existingOrderItem = await prisma.orderItem.findFirst({
      where: { id: parseInt(updated.orderitemId) }
      
    });


    const existingSizeandQuantity = await prisma.sizeQuantities.findMany({
      where: { orderitemId: updated.orderitemId },
      include: {
        orderitem: true
      
       
      },
    });

    let existingQuantity=0;
    let existingPrice=0;

    existingSizeandQuantity.map((element)=>{
      existingQuantity+=element.Quantity
      existingPrice+=element.Price
    })

    const updatedOrderItemQuantity=existingQuantity
    const updatedOrderItemPrice=existingPrice*updatedOrderItemQuantity



    const updatedOrderItem = await prisma.orderItem.update({
      where: { id: parseInt(updated.orderitemId) },
      data: {
        
        quantity:updatedOrderItemQuantity,
        price:updatedOrderItemPrice,
        updatedBy,
      },
    });

    const addOrderIntoActivityLog=await prisma.activityLog.create({
  data: {
    orderItemId:updated.orderitemId,
    
    action: "Size and Quantity Updated By",
    performedBy: updatedBy
  }
});


    res.status(200).json(updated);
  } catch (error) {
    console.error('Update SizeQuantity Error:', error);
    res.status(500).json({ message: 'Internal Server Error', error: error.message });
  }
};


const deleteSizeQuantity = async (req, res) => {
  try {
    const { id } = req.params;

    const existing = await prisma.sizeQuantities.findUnique({
      where: { id: parseInt(id) },
    });

    if (!existing) {
      return res.status(404).json({ message: 'SizeQuantity not found' });
    }

     const existingOrderItem = await prisma.orderItem.findFirst({
      where: { id: parseInt(existing.orderitemId) }
      
    });

    const existingOrderItemQuantity=(existingOrderItem.quantity)-existing.Quantity
    const existingOrderItemPrice=(existingOrderItem.price)-(existing.Price*existing.Quantity)



    const updatedOrderItem = await prisma.orderItem.update({
      where: { id: parseInt(existing.orderitemId) },
      data: {
        
        quantity:existingOrderItemQuantity,
        price:existingOrderItemPrice,
        
      },
    });
    await prisma.sizeQuantities.delete({
      where: { id: parseInt(id) },
    });

    res.status(200).json({ message: 'SizeQuantity deleted successfully' });
  } catch (error) {
    console.error('Delete SizeQuantity Error:', error);
    res.status(500).json({ message: 'Internal Server Error', error: error.message });
  }
};

module.exports = {
     getSingleSizeQuantity,createSizeQuantity,deleteSizeQuantity,updateSizeQuantity                                                                               
};