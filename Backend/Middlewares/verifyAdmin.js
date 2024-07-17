const jwt = require('jsonwebtoken');
const Admin = require('../Model/adminModel');
const { errorHandler } = require('../Utils/error');
require('dotenv').config();

const verifyAdmin = async (req, res, next) => {
    console.log("Middleware is calling ");
    try {
        const token = req.cookies.access_token;
        console.log("Token is ", token);

        // If token is undefined or null, redirect to the 404 page
        if (!token) {
            return res.redirect('/404');
        }

        const verified = jwt.verify(token, process.env.JWT_SECRET);
        console.log("Verified ", verified);

        const validAdmin = await Admin.findById(verified.id);
        console.log("Valid Admin ", validAdmin);

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
