const mongoose = require('mongoose');

const adminSchema = new mongoose.Schema({
  adminemail: { type: String, required: true},
  adminname: { type: String, required: true },
  password: { type: String, required: true },
});

const Admin = mongoose.model('Admin', adminSchema);

module.exports = Admin;
