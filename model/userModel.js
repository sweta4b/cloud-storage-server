const mongoose = require("mongoose");

const appUserSchema = new mongoose.Schema({
   email: {
    type: String,
    required: true
   },
   password: {
    type: String,
    required: true
   },
   role: {
    type: String,
    required: true
   }
})

const AppUser = mongoose.model('AppUser', appUserSchema);

module.exports = {AppUser}