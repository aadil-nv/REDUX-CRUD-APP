const jwt = require('jsonwebtoken');
const Admin = require('../Model/adminModel');
const { errorHandler } = require('../Utils/error');
require('dotenv').config();


const verifyAdmin = async (req, res, next) => {
    console.log("Middileware is calling ");
    try {
        const token = req.cookies.access_token;
        console.log("token is  ",token);
        if (!token) {
           
            return next(errorHandler(401, "Unauthorized - Admin session or token not found."));
            
        }
        
        const verified = jwt.verify(token, process.env.JWT_SECRET);
        console.log("verified ",verified);
        const validAdmin = await Admin.findById(verified.id);
        console.log("tvalidAdmin  ",validAdmin);

        if (!validAdmin) {
            return next(errorHandler(404, "Unauthorized - Admin not found."));
        }

        req.admin = validAdmin;
        next();
    } catch (error) {
        next(errorHandler(401, "Unauthorized"));
    }
};

module.exports = { verifyAdmin };