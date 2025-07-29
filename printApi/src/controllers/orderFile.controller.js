const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();


const createOrderFile = async (req, res) => {
  try {
    const { productId, orderId, uploadedBy, orderItemId } = req.body;

    if (!req.file) {
      return res.status(400).json({ message: 'File is required' });
    }

    const fileName = req.file.filename;
    const filePath = `/orderuploads/${fileName}`;

    const orderFile = await prisma.orderFile.create({
      data: {
        productId: productId ? parseInt(productId) : null,
        orderId: orderId ? parseInt(orderId) : null,
        fileName,
        filePath,
        uploadedBy,
      },
    });

     const addOrderIntoActivityLog=await prisma.activityLog.create({
  data: {
    orderId:parseInt(orderId),
    productId:parseInt(productId),
    orderItemId:parseInt(orderItemId),
    
    action: `File Uploaded By"`,
    performedBy: uploadedBy
  }
});

    res.status(201).json(orderFile);
  } catch (error) {
    console.error('Create OrderFile Error:', error);
    res.status(500).json({ message: 'Internal Server Error', error: error.message });
  }
};



const getOrderFiles = async (req, res) => {
  try {
    const { orderId, productId } = req.query;

    const files = await prisma.orderFile.findMany({
      where: {
        ...(orderId && { orderId: parseInt(orderId) }),
        ...(productId && { productId: parseInt(productId) }),
      },
      orderBy: { createdAt: 'desc' },
    });

    res.status(200).json(files);
  } catch (error) {
    console.error('Get OrderFiles Error:', error);
    res.status(500).json({ message: 'Internal Server Error', error: error.message });
  }
};


const updateOrderFile = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      productId,
      orderId,
      isApproved,
      approvedBy,
      approvedAt,
      updatedBy,
    } = req.body;

    const existing = await prisma.orderFile.findUnique({
      where: { id: parseInt(id) },
    });

    if (!existing) {
      return res.status(404).json({ message: 'OrderFile not found' });
    }

    let fileData = {};
    if (req.file) {
      fileData = {
        fileName: req.file.filename,
        filePath: `/uploads/orderfiles/${req.file.filename}`,
      };
    }

    const updated = await prisma.orderFile.update({
      where: { id: parseInt(id) },
      data: {
        productId: productId ? parseInt(productId) : undefined,
        orderId: orderId ? parseInt(orderId) : undefined,
        isApproved: isApproved === 'true' || isApproved === true,
        approvedBy,
        approvedAt: approvedAt ? new Date(approvedAt) : undefined,
        updatedBy,
        updatedAt: new Date(),
        ...fileData,
      },
    });

    const addOrderIntoActivityLog=await prisma.activityLog.create({
  data: {
    orderId:orderId,
    productId:productId,
    orderItemId:parseInt(orderItemId),
    
    action: `File Uploaded By`,
    performedBy: updatedBy
  }
});

    res.status(200).json(updated);
  } catch (error) {
    console.error('Update OrderFile Error:', error);
    res.status(500).json({ message: 'Internal Server Error', error: error.message });
  }
};


const deleteOrderFile = async (req, res) => {
  try {
    const { id } = req.params;

    const existing = await prisma.orderFile.findUnique({
      where: { id: parseInt(id) },
    });

    if (!existing) {
      return res.status(404).json({ message: 'OrderFile not found' });
    }

    await prisma.orderFile.delete({
      where: { id: parseInt(id) },
    });

    res.status(200).json({ message: 'OrderFile deleted successfully' });
  } catch (error) {
    console.error('Delete OrderFile Error:', error);
    res.status(500).json({ message: 'Internal Server Error', error: error.message });
  }
};


module.exports = {
    getOrderFiles,updateOrderFile,deleteOrderFile,createOrderFile                                                                              
};