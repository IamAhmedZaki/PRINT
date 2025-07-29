const express=require('express');
const router=express.Router()
const usersController=require('../controllers/users.controller')
const { authenticate } = require('../middlewares/auth.middleware');

// router.post('/',authenticate,usersController.createUser)
// router.get('/',authenticate,usersController.getAllUser)
router.post('/',usersController.createUser)
router.get('/',usersController.getAllUser)
router.get('/active',usersController.activeUsers)
router.get('/deactive',usersController.deactiveUsers)
router.get('/:id',usersController.singleUser)
router.put('/:id',usersController.updateUser)
router.delete('/:id',usersController.deleteUser)
router.patch('/:id/toggle-status',usersController.editActiveDeactiveUser)

module.exports = router;