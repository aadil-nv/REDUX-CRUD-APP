const {errorHandler} = require('../Utils/error.js')

const jwt = require('jsonwebtoken')


const verifyToken = (req,res,next)=>{
    console.log("======verify token is calling========");
    const token = req.cookies.access_token;
    console.log("======verify token is ========",token);
    if(!token ) return next(errorHandler(401,"Access denied"))
        jwt.verify(token , process.env.JWT_SECRET,(err,admin)=>{
        console.log("======verify token is correct=======",admin);
        if(err) return next(errorHandler(403,"Token is not valid"))
        req.admin = admin;
        next()
    })

}

module.exports={
    verifyToken
}