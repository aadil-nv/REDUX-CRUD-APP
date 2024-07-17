const express = require("express");
const user_router = express.Router();
const userController = require('../Controllers/userControllers');
const { verifyToken } = require("../Utils/verifyUser");

//todo---------------------------------------------------------------------------------

user_router.get('/',userController.test);
user_router.post('/update/:id',verifyToken,userController.updateUser);
user_router.delete('/delete/:id',verifyToken,userController.deleteUser);
user_router.get('/sign-out',userController.signOut)






//todo---------------------------------------------------------------------------------

module.exports = user_router;
