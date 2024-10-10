const mongoose = require('mongoose');
const plm = require('passport-local-mongoose');

const userSchema = new mongoose.Schema({
    email:{type:String, required: true, unique: true},
    username:{type:String, required: true, unique: true},
});

userSchema.plugin(plm);

module.exports = mongoose.model("User",userSchema);