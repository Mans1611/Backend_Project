const {Schema, model} = require("mongoose");
const courseSchema = new Schema ({
    Name :{
        type: String,
        requierd : true,
    },
    Code :{
        type: String,
        requierd : true,
        unique : true,
    },
    Year :{
        type: Number,
        requierd : true,
    },
    Instructor :{
        type: String,
        requierd : true,
    }
})

const Course = model("CourseSchema",courseSchema);
module.exports = Course;