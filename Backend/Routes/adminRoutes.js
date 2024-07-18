const express = require("express");
const admin_router = express.Router();
const adminController = require('../Controllers/adminController')
const {verifyToken} = require('../Utils/verifyAdmin')


admin_router.post('/admin-signin',adminController.adminSignIn);
admin_router.get('/users-data',verifyToken,adminController.usersData);
admin_router.get('/admin-fetch-userdata/:id',verifyToken,adminController.fetchUserData);
admin_router.post('/admin-update-userdata/:id',verifyToken,adminController.updateUserData);
admin_router.post('/admin-add-userdata',verifyToken,adminController.addUserData);
admin_router.delete('/delete-user/:id',adminController.deleteUser);
admin_router.get('/admin-signout',adminController.adminSignOut);



module.exports = admin_router;