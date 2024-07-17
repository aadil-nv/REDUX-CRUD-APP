const User = require("../Model/userModel.js");
const {errorHandler} = require('../Utils/error.js')
const bcrypt = require("bcryptjs");



//todo---------------------------------------------------------------------------------


const test = async (req,res)=>{
    try {
        res.json({message :"welcome to ooty nive to mmet you"})
        
    } catch (error) {
        console.log(error.message);
    }
};


const updateUser = async (req, res, next) => {
    if (req.user.id !== req.params.id) {
        return next(errorHandler(401, "You can update only your account"));
    }

    try {
        if (req.body.password) {
            req.body.password = bcrypt.hashSync(req.body.password, 10);
        }

        const updatedUser = await User.findByIdAndUpdate(
            req.params.id,
            {
                $set: {
                    username: req.body.username,
                    email: req.body.email,
                    password: req.body.password,
                    profilepicture: req.body.profilePicture,
                }
            },
            { new: true }
        );
        res.status(200).json(updatedUser);
    } catch (error) {
        next(error); 
    }
};



const deleteUser = async (req,res,next)=>{


    if(req.user.id !== req.params.id){
        return next(errorHandler(401,"You can only delete your account"))
    }

    try {
            await User.findByIdAndDelete({_id:req.params.id});
            res.status(200).json('User has been deleted')
    } catch (error) {
        next(error)
    }
}

const signOut = async (req,res,next)=>{
    res.clearCookies('access_token').status(200).json("Signout successfully")
}





//todo---------------------------------------------------------------------------------

module.exports={
    test,updateUser,deleteUser,signOut
}