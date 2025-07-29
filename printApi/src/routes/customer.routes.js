const express = require('express');
const router = express.Router();
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const customerController=require('../controllers/customer.controller')


// Create a customer
router.post('/create', customerController.createCustomer);

// Get all customers or a single customer by ID
router.get('/', customerController.getAllCustomers);
router.get('/:id', customerController.Customer);
router.put('/:id', customerController.updateCustomer);
router.delete('/:id', customerController.deleteCustomer);

module.exports = router;