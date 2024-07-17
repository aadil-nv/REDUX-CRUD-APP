const User = require("../Model/userModel");
const Admin = require("../Model/adminModel");
const bcrypt = require("bcryptjs");
const { errorHandler } = require('../Utils/error');
const jwt = require('jsonwebtoken');
require('dotenv').config();

const adminSignIn = async (req, res, next) => {
    try {
      const { adminemail, password } = req.body;
      const validAdmin = await Admin.findOne({ adminemail });
      if (!validAdmin) return next(errorHandler(404, "User not found"));
      const validPassword = bcrypt.compareSync(password, validAdmin.password);
      if (!validPassword) return next(errorHandler(401, "Invalid Credentials"));
      const token = jwt.sign({ id: validAdmin._id }, process.env.JWT_SECRET);
      const { password: hashedPassword, ...rest } = validAdmin._doc;
      const expiryDate = new Date(Date.now() + 36000000); // 1 hour
      res.cookie('access_token', token, { httpOnly: true, expires: expiryDate }).status(200).json(rest);
    } catch (error) {
      console.log("-----signin-------", error.message);
      next(errorHandler(500, "Something went wrong"));
    }
  };


  const usersData = async (req, res, next) => {
    try {
        const token = req.cookies.access_token;
        if (!token) {
            return next(errorHandler(401, "Unauthorized - Admin session or token not found."));
        }

        const verified = jwt.verify(token, process.env.JWT_SECRET);
        const validAdmin = await Admin.findById(verified.id);

        if (!validAdmin) {
            return next(errorHandler(404, "Unauthorized - Admin not found."));
        }

        const users = await User.find();
        res.status(200).json(users);
    } catch (error) {
        next(errorHandler(500, "Something went wrong"));
        console.log("======USER DATA ERROR=======", error.message);
    }
};



const fetchUserData = async (req, res, next) => {
   
    try {
        const token = req.cookies.access_token;
        if (!token) {
            return next(errorHandler(401, "Unauthorized - Admin session or token not found."));
        }

        const userId = req.params.id;
        const userData = await User.find({_id:userId});
       

        res.status(200).json(userData);
    } catch (error) {
        next(errorHandler(500, "Something went wrong"));
        console.log("======FeTCH DATA ERROR=======", error.message);
    }
};



const updateUserData = async (req, res, next) => {
    try {
        const token = req.cookies.access_token;
        if (!token) {
            return next(errorHandler(401, "Unauthorized - Admin session or token not found."));
        }
        if (!req.params.id) {
            return next(errorHandler(401, "Id is not found"));
        }

     
        if (req.body.password !== null && req.body.password !== undefined) {
            req.body.password = bcrypt.hashSync(req.body.password, 10);
        } else {
           
            delete req.body.password;
        }

        const updatedUser = await User.findByIdAndUpdate(
            req.params.id,
            {
                $set: {
                    username: req.body.username,
                    email: req.body.email,
                    password: req.body.password,
                    profilepicture: req.body.profilepicture,
                }
            },
            { new: true }
        );
        res.status(200).json(updatedUser);
        
    } catch (error) {
        next(errorHandler(500, "Something went wrong"));
        console.log("======UPDATE DATA ERROR=======", error.message);
    }
}


const addUserData = async (req,res,next)=>{
    
    const token = req.cookies.access_token;
    if (!token) {
        return next(errorHandler(401, "Unauthorized - Admin session or token not found."));
    }
    try {


        const {username , email, password,profilepicture} = req.body;
        console.log("body data isn"+req.body);
        const hashedPassword = bcrypt.hashSync(password,10);
        const newUser = new User({username,email,password:hashedPassword ,profilepicture});
        await newUser.save();
        res.status(201).json({message:"User created succesfully ._."})

        
    } catch (error) {
        next(errorHandler(500, "Something went wrong"));
        console.log("======ADD DATA ERROR=======", error.message);
    }
    }




    const deleteUser = async(req,res,next)=>{
      
        try {

          
            const userId = req.params.id
            console.log("userId"+userId);
            if(! req.params.id){
                return next(errorHandler(401,"You can only delete your account"))
            }
            
            await User.findByIdAndDelete({_id:req.params.id});
           res.status(200).json('User has been deleted')

        } catch (error) {
            next(errorHandler(500, "Something went wrong"));
            console.log("======DELET USER ERROR=======", error.message);
        }
    }



    const adminSignOut = async (req,res,next)=>{
        console.log("----------------adminSignout------------------");
       try {
        res.clearCookie('access_token', { path: '/' }).status(200).json({ message: 'Logged out and token cleared' });
        
       } catch (error) {
        next(errorHandler(500, "Something went wrong"));
            console.log("======aDMIN SIGNOUT ERROR=======", error.message);
       }
    }

module.exports = {
    adminSignIn,usersData,fetchUserData,updateUserData,addUserData,deleteUser,adminSignOut
};
