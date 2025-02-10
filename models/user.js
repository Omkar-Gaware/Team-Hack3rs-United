const { required } = require("joi");
const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const passportLocalMongoose = require('passport-local-mongoose');

const userSchema = Schema({
    email:{
        type: String,
        required: true
    },
    age :{
        type : Number,
        required : true
    },
    phone:{
        type : Number,
        required :true
    }
});

userSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model('User', userSchema);