const User = require("../Model/userModel");
const bcrypt = require("bcryptjs");
const {errorHandler} = require('../Utils/error.js')
const jwt = require('jsonwebtoken')
require('dotenv').config();




//todo---------------------------------------------------------------------------------


const signUp = async (req,res,next)=>{
    try {
        const {username , email, password} = req.body;
        const hashedPassword = bcrypt.hashSync(password,10);
        const newUser = new User({username,email,password:hashedPassword});
        await newUser.save();
        res.status(201).json({message:"User created succesfully ._."})
        
    } catch (error) {
        next(errorHandler(300,"somthing went wrong"))
        console.log("======SIGNUP=======",error.message);
    }
};


const signIn = async(req,res,next)=>{
    try {
        const {email,password} = req.body;
        const validUser = await User.findOne({email});
        if(!validUser) return next(errorHandler(404,"User not found"));
        const validPassword = bcrypt.compareSync(password,validUser.password)
        if(!validPassword) return next(errorHandler(401,"Invalid Credentials"));
        const token = jwt.sign({id:validUser._id },process.env.JWT_SECRET);
        const {password:hashedPassword,...rest}=validUser._doc
        const expiryDate = new Date(Date.now()+3600000);
        res.cookie('access_token',token , {httpOnly : true,expier:expiryDate}).status(200).json(rest)
    } catch (error) {
        next(error);
    }
}


const googleAuth = async(req,res,next)=>{
    try {
        const user = await User.findOne({email:req.body.email})
        if(user){

            const token = jwt.sign({id:user._id},process.env.JWT_SECRET)
            const {password : hashedPassword , ...rest } = user._doc;
            const expiryDate = new Date(Date.now()+3600000);
            res.cookie('access_token',token , {httpOnly : true,expier:expiryDate}).status(200).json(rest)

        }else{
            console.log("=============MY PICTURE===================",req.body.photo)
            const generatePassword = Math.random().toString(36).slice(-8);
            const hashedPassword = bcrypt.hashSync(generatePassword,10);
            const newUser =  new User({
                username:req.body.name.split(" ").join('').toLowerCase() + Math.floor(Math.random()* 10000).toString(),
                email:req.body.email,
                password:hashedPassword,
                profilepicture:req.body.photo || "https://shorturl.at/zTElG"
            });

            await newUser.save()
            const token = jwt.sign({id:newUser._id},process.env.JWT_SECRET)
            const {password : hashedPassword2 , ...rest } = newUser._doc;
            const expiryDate = new Date(Date.now()+3600000);
            res.cookie('access_token',token , {httpOnly : true,expier:expiryDate}).status(200).json(rest)
        }

    } catch (error) {
        next(error);
    }
}






//todo---------------------------------------------------------------------------------

module.exports={
    signUp,signIn,googleAuth
}