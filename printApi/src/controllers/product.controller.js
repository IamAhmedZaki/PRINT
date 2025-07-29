const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const path = require('path');

// Create Product with uploaded files and sizeQuantities
exports.createProduct = async (req, res) => {
  try {
    const { title, unitPrice, serviceId, category, colorOptions, sizeOptions,createdBy } = req.body;

    if (!title || !unitPrice || !serviceId || !category) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    // Save uploaded files
    const uploadedFiles = req.files?.map(file => ({
      filename: file.filename,
      path: `/orderuploads/${file.filename}`
    })) || [];

    // Parse colorOptions and sizeQuantities if sent as strings
    const parsedColorOptions = colorOptions ? JSON.parse(colorOptions) : [];
    const parsedSizeOptions = sizeOptions ? JSON.parse(sizeOptions) : [];
    

    const newProduct = await prisma.product.create({
      data: {
        title,
        unitPrice: parseFloat(unitPrice),
        serviceId: parseInt(serviceId),
        category,
        colorOptions: parsedColorOptions,
        sizeOptions:parsedSizeOptions,
        createdBy,
        files: {
          create: uploadedFiles.map(f => ({
            fileName: f.filename,
            filePath: f.path,
            uploadedBy:createdBy
          }))
        }
      
      },
      include: {
        files: true,
        
      }
    });

    
    
    
    res.status(201).json(newProduct);
  } catch (error) {
    console.error("Create Product Error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Get all products
exports.getAllProducts = async (req, res) => {
  try {
    const products = await prisma.product.findMany({
      include: {
                files:true,
                service: {
                  include: {
                    workflow: {
                        include: {
                        stages: true, // Workflow stages
                      },
                    },
                  },
                },
              }
    });
    res.json(products);
  } catch (error) {
    console.error("Get Products Error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Get single product
exports.getProductById = async (req, res) => {
  try {
    const { id } = req.params;

    const product = await prisma.product.findUnique({
      where: { id: parseInt(id) },
      include: {
                files:true,
                service: {
                  include: {
                    workflow: {
                      include: {
                        stages: true, // Workflow stages
                      },
                    },
                  },
                },
              }
    });

    if (!product) return res.status(404).json({ message: "Product not found" });

    res.json(product);
  } catch (error) {
    console.error("Get Product Error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Update product
exports.updateProduct = async (req, res) => {
  try {
    const productId = parseInt(req.params.id);
    const { title, unitPrice, serviceId, category, colorOptions,updatedBy } = req.body;

    const existingProduct = await prisma.product.findUnique({
      where: { id: productId },
      include: { files: true }
    });

    if (!existingProduct) {
      return res.status(404).json({ message: "Product not found" });
    }

    const uploadedFiles = req.files?.map(file => ({
      filename: file.filename,
      path: `/orderuploads/${file.filename}`
    })) || [];

    // Parse colorOptions and sizeQuantities if sent as strings
    const parsedColorOptions = colorOptions ? JSON.parse(colorOptions) : [];
    

    // Delete existing files if new ones are uploaded
    if (uploadedFiles.length > 0) {
      await prisma.orderFile.deleteMany({
        where: { productId }
      });
    }

   

    const updatedProduct = await prisma.product.update({
      where: { id: productId },
      data: {
        title,
        unitPrice: parseFloat(unitPrice),
        serviceId: parseInt(serviceId),
        category,
        updatedBy,
        colorOptions: parsedColorOptions,
        ...(uploadedFiles.length > 0 && {
          files: {
            create: uploadedFiles.map(f => ({
              fileName: f.filename,
              filePath: f.path,
              updatedBy:updatedBy
            }))
          }
        })
      },
      include: {
        files: true,
        
      }
    });

    res.status(200).json(updatedProduct);
  } catch (error) {
    console.error("Update Product Error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Delete product
exports.deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;

    await prisma.product.delete({
      where: { id: parseInt(id) }
    });

    res.json({ message: "Product deleted successfully" });
  } catch (error) {
    console.error("Delete Product Error:", error);
    if (error.code === 'P2025') {
      return res.status(404).json({ message: "Product not found" });
    }
    res.status(500).json({ message: "Internal server error" });
  }
};
