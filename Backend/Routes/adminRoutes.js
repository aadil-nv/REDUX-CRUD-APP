const express = require("express");
const admin_router = express.Router();
const adminController = require('../Controllers/adminController')
const {verifyAdmin} = require('../Middlewares/verifyAdmin')


admin_router.post('/admin-signin',adminController.adminSignIn);
admin_router.use(verifyAdmin);

admin_router.get('/users-data',adminController.usersData);
admin_router.get('/admin-fetch-userdata/:id',adminController.fetchUserData);
admin_router.post('/admin-update-userdata/:id',adminController.updateUserData);
admin_router.post('/admin-add-userdata',adminController.addUserData);
admin_router.delete('/delete-user/:id',adminController.deleteUser);
admin_router.get('/admin-signout',adminController.adminSignOut);



module.exports = admin_router;