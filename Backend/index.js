const express = require('express');
const color = require('colors');
const app = express();
const mongoose = require('mongoose');
require('dotenv').config();
const { log } = require('console');
const PORT = process.env.PORT;
const URI = process.env.URI;
const userRoutes = require('./Routes/userRoutes');
const authRoutes = require('./Routes/authRoutes');
const adminRoutes = require('./Routes/adminRoutes');
const cookieParser = require('cookie-parser')



mongoose.connect(URI).then((data)=>console.log("mongodb connected atlas success".bgBrightBlue.bold.underline));
app.use(express.json());
app.use(cookieParser());
app.use('/api/users',userRoutes);
app.use('/api/auth',authRoutes);

app.use('/api/admin',adminRoutes)



app.use((error,req,res,next)=>{
    const statusCode = error.statusCode || 500;
    const message = error.message || "Internal server error";
    return res.status(statusCode).json({
        success : false,
        message,
        statusCode : statusCode
    })
})
app.listen(3000, console.log(`server started on port http://localhost:${PORT}`.bgBrightWhite.bold.underline));