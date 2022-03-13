const { string, number } = require('joi');
const {Schema,model } = require('mongoose');
 
const studentSchema = new Schema({
    fullName:{
        type: String,
        required:true
    },
    email:{
        type: String,
        required:false
    },
    password : {
        type:String,
        required: true,
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
    }

})
const Student = model("Student",studentSchema);
module.exports = Student;