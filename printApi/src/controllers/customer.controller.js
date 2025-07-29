const {PrismaClient}=require('@prisma/client')
const prisma= new PrismaClient();
const bcrypt = require('bcryptjs');

exports.createCustomer=async (req, res) => {
  try {
    const {name,company,mobile,mobile2,address,email}=req.body
    const customers=await prisma.customer.create({
      data:{
        name,email,mobile,mobile2,company,address
      }

    })
    res.status(201).json(customers)
  } catch (error) {
    res.status(400).json({error:error.message})
  }
}


exports.getAllCustomers=async(req,res)=>{
  try {
    const allCustomers=await prisma.customer.findMany()
    res.status(201).json(allCustomers)
  } catch (error) {
    res.status(400).json({error:error.message})
  }
}


exports.Customer=async(req,res)=>{
  const custId=parseInt(req.params.id)
  
  try {
    const Customers=await prisma.customer.findUnique(
      {
        where:{id:custId}
      }
    )
    res.status(201).json(Customers)
  } catch (error) {
    res.status(400).json({error:error.message})
  }
}

exports.deleteCustomer = async (req, res) => {
  try {
    const { id } = req.params;

    const deletedCustomer = await prisma.customer.delete({
      where: { id: parseInt(id) } // If your ID is an integer
    });
    
    res.status(200).json({ message: "Customer deleted successfully", deletedCustomer });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};


exports.updateCustomer=async (req, res) => {
  try {
    const {id}=req.params
    const {name,company,mobile,mobile2,address,email}=req.body
    const updatedCustomers=await prisma.customer.update({
      where:{id: parseInt(id)},
      data:{
        name,email,mobile,mobile2,company,address
      }

    })
    res.status(201).json(updatedCustomers)
  } catch (error) {
    res.status(400).json({error:error.message})
  }
}


