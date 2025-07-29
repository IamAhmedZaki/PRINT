const jwt = require('jsonwebtoken');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
require('dotenv').config();

const authenticate = async (req, res, next) => {
  try {
    // 1. Get token from header

     const authHeader = req.header('Authorization');
    console.log('Auth header:', authHeader);
    
    const token = authHeader?.replace('Bearer ', '');
    console.log('Extracted token:', token);
    

    if (!token) {
      return res.status(401).json({ error: 'No token, authorization denied' });
    }

    // 2. Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // 3. Find user in database
    const user = await prisma.users.findUnique({
      where: { id: decoded.id },
      select: {
        id: true,
        username: true,
        email: true,
        is_admin: true,
        is_manager: true,
        is_member: true
      }
    });

    if (!user) {
      return res.status(401).json({ error: 'User not found' });
    }

    // 4. Attach user to request object
    req.user = user;
    next();

  } catch (error) {
    res.status(401).json({ error: 'Token is not valid' });
  }
};

module.exports = {
  authenticate
};