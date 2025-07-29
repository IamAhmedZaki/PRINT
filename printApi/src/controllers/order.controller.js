const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const crypto = require('crypto');
const nodemailer = require('nodemailer');

// Email configuration
const createEmailTransporter = () => {
  return nodemailer.createTransport({
    // Gmail configuration (you can change this based on your email provider)
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER, // Your email
      pass: process.env.EMAIL_PASS  // Your app password
    }
    
    // Alternative SMTP configuration:
    /*
    host: process.env.SMTP_HOST,
    port: process.env.SMTP_PORT,
    secure: false, // true for 465, false for other ports
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS
    }
    */
  });
};

// Email template for order confirmation
const generateOrderConfirmationEmail = (order) => {
  const trackingUrl = `https://elipsestudio.com/CustomerChecker/customercheckpage.html`;
  
  return {
    subject: `Order Confirmation - ${order.orderNumber}`,
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background-color: #f4f4f4; padding: 20px; text-align: center; }
          .content { padding: 20px; }
          .tracking-box { background-color: #e8f4f8; padding: 15px; border-radius: 5px; margin: 20px 0; }
          .tracking-link { display: inline-block; background-color: #007cba; color: white; padding: 10px 20px; text-decoration: none; border-radius: 3px; }
          .order-details { background-color: #f9f9f9; padding: 15px; border-radius: 5px; }
          .footer { text-align: center; padding: 20px; font-size: 12px; color: #666; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>Order Confirmation</h1>
          </div>
          
          <div class="content">
            <p>Dear ${order.customer.name},</p>
            
            <p>Thank you for your order! We've received your order and it's being processed.</p>
            
            <div class="tracking-box">
              <h3>Track Your Order</h3>
              <p><strong>Order Number:</strong> ${order.orderNumber}</p>
              <p><strong>Tracking Token:</strong> ${order.token}</p>
              <p>You can track your order status using the link below:</p>
              <a href="${trackingUrl}" class="tracking-link">Track Order</a>
            </div>
            
            <div class="order-details">
              <h3>Order Details</h3>
              <p><strong>Title:</strong> ${order.title}</p>
              <p><strong>Status:</strong> ${order.status}</p>
              <p><strong>Due Date:</strong> ${new Date(order.dueDate).toLocaleDateString()}</p>
              ${order.startDate ? `<p><strong>Start Date:</strong> ${new Date(order.startDate).toLocaleDateString()}</p>` : ''}
              ${order.notes ? `<p><strong>Notes:</strong> ${order.notes}</p>` : ''}
            </div>
            
            ${order.items && order.items.length > 0 ? `
            <div class="order-details">
              <h3>Order Items</h3>
              ${order.items.map(item => `
                <div style="margin-bottom: 10px; padding: 10px; border-left: 3px solid #007cba;">
                  <p><strong>${item.product ? item.product.name : 'Product'}</strong></p>
                  <p>Color: ${item.color}</p>
                  <p>Quantity: ${item.quantity}</p>
                  <p>Price: $${item.price}</p>
                </div>
              `).join('')}
            </div>
            ` : ''}
            
            <p>If you have any questions about your order, please don't hesitate to contact us.</p>
            
            <p>Best regards,<br>Your Company Team</p>
          </div>
          
          <div class="footer">
            <p>This is an automated email. Please do not reply directly to this email.</p>
          </div>
        </div>
      </body>
      </html>
    `,
    text: `
      Order Confirmation - ${order.orderNumber}
      
      Dear ${order.customer.name},
      
      Thank you for your order! We've received your order and it's being processed.
      
      Order Details:
      - Order Number: ${order.orderNumber}
      - Tracking Token: ${order.token}
      - Title: ${order.title}
      - Status: ${order.status}
      - Due Date: ${new Date(order.dueDate).toLocaleDateString()}
      ${order.startDate ? `- Start Date: ${new Date(order.startDate).toLocaleDateString()}` : ''}
      ${order.notes ? `- Notes: ${order.notes}` : ''}
      
      Track your order: ${trackingUrl}
      
      Best regards,
      Your Company Team
    `
  };
};

// Send order confirmation email
const sendOrderConfirmationEmail = async (order) => {
  try {
    const transporter = createEmailTransporter();
    const emailContent = generateOrderConfirmationEmail(order);
    
    const mailOptions = {
      from: process.env.EMAIL_FROM || process.env.EMAIL_USER,
      to: order.customer.email,
      subject: emailContent.subject,
      html: emailContent.html,
      text: emailContent.text
    };
    
    const result = await transporter.sendMail(mailOptions);
    console.log('Order confirmation email sent:', result.messageId);
    return { success: true, messageId: result.messageId };
    
  } catch (error) {
    console.error('Error sending order confirmation email:', error);
    return { success: false, error: error.message };
  }
};

// Updated createOrder function with email functionality
const createOrder = async (req, res) => { 
  try { 
    const { 
      customerId, 
      orderNumber, 
      title, 
      status = 'Draft', 
      startDate, 
      dueDate, 
      notes, 
      items, 
      createdBy 
    } = req.body; 
 
    const uploadedFiles = req.files?.map(file => ({ 
      filename: file.filename, 
      path: `/orderuploads/${file.filename}` 
    })) || []; 
 
    let parsedItems = []; 
 
    if (typeof items === 'string') { 
      try { 
        parsedItems = JSON.parse(items); 
      } catch (e) { 
        return res.status(400).json({ message: 'Invalid JSON in items field' }); 
      } 
    } else { 
      parsedItems = items; 
    } 
    
    const enrichedItems = await Promise.all(
  parsedItems.map(async (item) => {
    const product = await prisma.product.findUnique({
      where: { id: parseInt(item.productId) },
      include: {
        service: {
          include: {
            workflow: {
              include: {
                stages: true
              }
            }
          }
        }
      }
    });

    


    const firstStage = product?.service?.workflow?.stages?.[0]?.title || 'Pending';

    return {
      productId: parseInt(item.productId),
      color: item.color,
      quantity: item.quantity,
      price: item.price,
      currentStage: firstStage,
      sizeQuantities: {
        create: item.sizeQuantities?.map(sq => ({
          Size: sq.Size,
          Price: sq.Price,
          Quantity: sq.Quantity
        })) || [],
      }
    };
  })
);
    // Generate a unique token for tracking
    const trackingToken = crypto.randomBytes(8).toString('hex').toUpperCase();
    
    const newOrder = await prisma.order.create({ 
      data: { 
        customerId: parseInt(customerId), 
        orderNumber, 
        title, 
        status, 
        startDate: startDate ? new Date(startDate) : null, 
        dueDate: new Date(dueDate), 
        notes, 
        files: { 
          create: uploadedFiles.map(f => ({ 
            fileName: f.filename, 
            filePath: f.path, 
            uploadedBy: createdBy 
          })) 
        }, 
        items: { 
          create: enrichedItems, 
        }, 
        token: trackingToken,
        createdBy
      }, 
      include: { 
        files: true, 
        items: { 
          include: { sizeQuantities: true, product: true }, 
        }, 
        customer: true, 
      }, 
    }); 

    
    
    let addOrderItemIntoActivityLog=await Promise.all(newOrder.items.map(async(item)=>{
      const activity=await prisma.activityLog.create({
  data: {
    
    orderItemId: item.id,
    action: `OrderItem Created By"`,
    performedBy: createdBy
  }
});
    }))
   
  const addOrderIntoActivityLog=await prisma.activityLog.create({
  data: {
    orderId:newOrder.id,
    
    action: `Order Created By"`,
    performedBy: createdBy
  }
});
    
 
    // Send confirmation email to customer
    const emailResult = await sendOrderConfirmationEmail(newOrder);
    
    if (!emailResult.success) {
      console.warn('Failed to send order confirmation email:', emailResult.error);
      // Don't fail the order creation if email fails
    }
 
    res.status(201).json({
      ...newOrder,
      emailSent: emailResult.success
    }); 
  } catch (err) { 
    console.error('Error creating order:', err); 
    res.status(500).json({ message: 'Internal server error', error: err.message }); 
  } 
};



const getProductColors = async (req, res) => {
  const productId  = req.params.id;

  try {
    const product = await prisma.product.findUnique({
      where: { id: parseInt(productId) },
      select: {
        id: true,
        title: true,
        colorOptions: true,
      },
    });

    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    res.json({
      productId: product.id,
      title: product.title,
      colors: product.colorOptions || [],
    });
  } catch (err) {
    console.error('Error fetching product colors:', err);
    res.status(500).json({ message: 'Internal server error' });
  }
};
const getProductSizes = async (req, res) => {
  const productId  = req.params.id;

  try {
    const product = await prisma.product.findUnique({
      where: { id: parseInt(productId) },
      select: {
        id: true,
        title: true,
        sizeOptions: true,
      },
    });

    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    res.json({
      productId: product.id,
      title: product.title,
      sizess: product.colorOptions || [],
    });
  } catch (err) {
    console.error('Error fetching product colors:', err);
    res.status(500).json({ message: 'Internal server error' });
  }
};



const getAllOrders = async(req,res)=>{
  try {
    const orders = await prisma.order.findMany({
      include: {
        customer: true, // Get Customer details
        items: {
          include: {
            product: {
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
              },
            },
            sizeQuantities: true,
            comments: true,
          },
        },
        files: true,
        comments: true,
      }
      
    });

    res.status(200).json(orders);
  } catch (error) {
    console.error("Error fetching orders:", error);
    res.status(500).json({ message: 'Internal server error', error: error.message });
  }
};
const getSingleOrders = async(req,res)=>{
  try {
    const orderId=req.params.id
    const orders = await prisma.order.findUnique({
      where:{id:parseInt(orderId)},
      include: {
        customer: true, // Get Customer details
        items: {
          include: {
            product: {
              
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
              },
            },
            sizeQuantities: true,
            comments: true,
          },
        },
        files: true,
        comments: true,
      }
      
    });

    res.status(200).json(orders);
  } catch (error) {
    console.error("Error fetching orders:", error);
    res.status(500).json({ message: 'Internal server error', error: error.message });
  }
};






const updateOrder = async (req, res) => {
  try {
    const orderId = parseInt(req.params.id); // Order ID from URL param
    const {
      customerId,
      orderNumber,
      title,
      status ,
      startDate,
      dueDate,
      notes,
      updatedBy
    } = req.body;

    const updatedOrder = await prisma.order.update({
    where: { id: orderId },
    data: {
        customerId: customerId ? parseInt(customerId) : undefined,
        orderNumber,
        title,
        status,
        startDate: startDate ? new Date(startDate) : undefined,
        dueDate: dueDate ? new Date(dueDate) : undefined,
        notes,
        updatedBy
        
       
      },
      include: {
        files: true,
        items: {
          include: {
            sizeQuantities: true,
            product: true
          }
        },
        customer: true
      }
    });


  const addOrderIntoActivityLog=await prisma.activityLog.create({
  data: {
    orderId:orderId,
    
    action: `Order Updated By"`,
    performedBy: updatedBy
  }
});

    res.status(200).json(updatedOrder);
  } catch (err) {
    console.error('Error updating order:', err);
    res.status(500).json({ message: 'Internal server error', error: err.message });
  }
};



const deleteOrder = async (req, res) => {
  try {
    const orderId = parseInt(req.params.id);
    const performedBy = req.user?.email || req.user?.username || 'Unknown';

    const existingOrder = await prisma.order.findUnique({
      where: { id: orderId }
    });

    if (!existingOrder) {
      return res.status(404).json({ message: "Order not found" });
    }

    await prisma.order.delete({
      where: { id: orderId }
    });

    await prisma.activityLog.create({
  data: {
    orderId: orderId,
    action: `Order Deleted by ${req.user.username || req.user.email}`,
    performedBy: req.user.username,
  }
});


    res.status(200).json({ message: "Order deleted successfully" });
  } catch (err) {
    console.error("Delete Order Error:", err);
    res.status(500).json({ message: "Internal server error", error: err.message });
  }
};



const orderFromToken=async (req,res) => {
  
  const token=req.params.token;

  try {
    const existingOrder = await prisma.order.findFirst({
      where: { token: token },
      include: {
        customer: true, // Get Customer details
        items: {
          include: {
            product: {
              include: {
                service: {
                  include: {
                    workflow: {
                      include: {
                        stages: true, // Workflow stages
                      },
                    },
                  },
                },
              },
            },
            sizeQuantities: true,
            comments: true,
          },
        },
        files: true,
        comments: true,
      }
    });
     res.status(200).json(existingOrder);
  } catch (error) {
  console.error('Error fetching order by token:', error);
  res.status(500).json({ message: 'Internal Server Error' });
}
  
}




module.exports = {
  createOrder,getAllOrders,getProductColors,getSingleOrders,updateOrder,deleteOrder,orderFromToken,getProductSizes                                                                                 
};






