const express = require("express");
const auth_router = express.Router();
const authController = require('../Controllers/authControllers')

//todo-------------------------------------------------------------------------------


auth_router.post('/sign-up',authController.signUp);
auth_router.post('/sign-in',authController.signIn);
auth_router.post('/google-auth',authController.googleAuth)








//todo---------------------------------------------------------------------------------
module.exports = auth_router;