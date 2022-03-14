const { string, number, array, boolean } = require('joi');
const {Schema,model } = require('mongoose');
 
const studentSchema = new Schema({
    fullName:{
        type: String,
        required:true
    },
    email:{
        type: String,
        required:true,
        unique: true
    },
    password : {
        type:String,
        required: true,
    },
    birthDate:{
        type: String,
        required: true
    },
    gender:{
        type: String,
        required:true
    },
    grade:{
        type:Number,
        required : true,
    }, 
    schoolName : {
        type : String,
        required : true
    },
    isAdmin:{
        type:Boolean,
        default:false 
    },
    verified:{
        type:Boolean,
        default:false
    },
    courses : {
        type:Array, 
    }
})
const User = model("Student",studentSchema);
module.exports = User;