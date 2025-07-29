const {PrismaClient}=require('@prisma/client')
const prisma= new PrismaClient();
const bcrypt = require('bcryptjs');

exports.createUser=async (req,res) => {
    
    
    try {
        const { username,
            email,
            password,
            firstName,
            lastName,
            isActive,
            isAdmin,
            isManager,
            isMember}=req.body;
            const hashedPassword=await bcrypt.hash(password,10)
        const user= await prisma.user.create({
            data:{
                username,
                email,
                passwordHash:hashedPassword,
                firstName,
                lastName,
                isActive,
                isAdmin,
                isManager,
                isMember


            },
        })
        const {passwordHash,...userData}=user
        res.status(201).json(userData)
    } catch (error) {
         res.status(400).json({ error: error.message });
    }
}


exports.getAllUser=async (req,res) => {
    try {
        const allUsers=await prisma.user.findMany();
        res.status(201).json(allUsers)
    } catch (error) {
         res.status(400).json({ error: error.message });
    }
}


exports.singleUser=async (req,res) => {
    try {
        const { id } = req.params;
        const user=await prisma.user.findUnique({
            where:{id:Number(id)}
        });
        res.status(201).json(user)
    } catch (error) {
         res.status(400).json({ error: error.message });
    }
}

exports.deleteUser = async (req, res) => {
  try {
    const { id } = req.params;

    const deletedUser = await prisma.user.delete({
      where: { id: Number(id) } // If your ID is an integer
    });
    
    res.status(200).json({ message: "User deleted successfully", deletedUser });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};


exports.updateUser = async (req, res) => {
  try {
    const {id} = req.params;
    const { username, email, password, firstName, lastName, isActive, isAdmin, isManager, isMember } = req.body;
    
    const updateData = {
      username,
      email,
      firstName,
      lastName,
      isActive,
      isAdmin,
      isManager,
      isMember
    };

    // Only update password if it's provided
    if (password) {
      const hashedPassword = await bcrypt.hash(password.toString(), 10);
      updateData.passwordHash = hashedPassword;
    }

    const user = await prisma.user.update({
      where: { id: parseInt(id) },
      data: updateData
    });

    const {passwordHash, ...userData} = user;
    res.status(201).json(userData);
   
  } catch (error) {
    res.status(400).json({error: error.message});
  }
}


exports.activeUsers=async (req,res) => {
    try {
        const activeUsers=await prisma.user.findMany({
            where:{isActive:true},
            select:{
                 id: true,
                username: true,
                email: true,
                firstName: true,
                lastName: true,
                isActive: true,
                createdAt: true
            }
        });
        res.status(201).json(activeUsers)
    } catch (error) {
         res.status(400).json({ error: error.message });
    }
}

exports.deactiveUsers=async (req,res) => {
    try {
        const deactiveUsers=await prisma.user.findMany({
            where:{isActive:false},
            select:{
                 id: true,
                username: true,
                email: true,
                firstName: true,
                lastName: true,
                isActive: true,
                createdAt: true
            }
        });
        res.status(201).json(deactiveUsers)
    } catch (error) {
         res.status(400).json({ error: error.message });
    }
}


exports.editActiveDeactiveUser = async (req, res) => {
  try {
    const {id} = req.params;
    
    const user= await prisma.user.findUnique({
        where:{id:parseInt(id)},
        select:{isActive:true}

    })

    const updatedUser=await prisma.user.update({
        where:{id:parseInt(id)},
        data:{isActive:!user.isActive},
        select:{
            id: true,
        username: true,
        email: true,
        isActive: true
        }
    })


    
    res.status(200).json({
      success: true,
      message: `User ${updatedUser.username} has been ${
        updatedUser.isActive ? 'activated' : 'deactivated'
      } successfully`,
      user: updatedUser
    });
   
    

    
   
  } catch (error) {
    res.status(400).json({error: error.message});
  }
}