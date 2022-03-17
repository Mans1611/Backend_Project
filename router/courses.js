const router = require('express').Router();
const joi = require('joi');
const jwt = require('json-web-token');
const { resetWatchers } = require('nodemon/lib/monitor/watch');
const User = require('../models/Student');
const Courses = require('../models/CourseSchema');
const auth = require('../middleware/auth');
const { modelName } = require('../models/Student');
const checkValidation = require('../checkValidation');
router.get("/", async (req, res) => { // check requiurement
    try {
      const courses = await Courses.find({});
      res.status(200).json({ courses });
    } catch (err) {
      res.status(500).json({ err });
    }
});

const courseValidation = joi.object({
    Name : joi.string().required(),
    Code: joi.string().required(),
    Year : joi.number().required(),
    Instructor : joi.string().required()
})

router.post('/add',auth,async(req,res)=>{
    const {error} = courseValidation.validate(req.body,{abortEarly:false});
    if (error) 
        return res.status(404).send(checkValidation(error));

      try{
          const {email} = req.payload; 
          //console.log(req.payload.email);
          const user = await User.findOne({email});
          //console.log(req.body);
        if(!user.isAdmin)
            return res.status(401).json({msg : "you are not admin"});
        await new Courses(req.body).save()
        .then(()=>console.log("course is added"))
        .catch((err)=>res.status(404).send(err));
        res.status(200).json({msg:"course is add succussfully"});    
      }catch(err){
          res.status(500).send(err);
      }  
})
const courseUpdateValidation = joi.object({
  Name : joi.string(),
  Code: joi.string(),
  Year : joi.number(),
  Instructor : joi.string(),
})

router.put('/:course_code/edit',auth,async(req,res)=>{
      const {error} = courseUpdateValidation.validate(req.body,{abortEarly:false});
      if(error)
        return res.status(400).send(checkValidation(error));
      const {email} = req.payload;
      const user = await User.findOne({email});
      if(!user.isAdmin)
        return res.status(401).send("you are not an admin");

      try{
        const {course_code} = req.params;
        const course = await Courses.findOne({course_code});
        if(!course)
          return res.status(404).send("this course is not found");
        await Courses.findOneAndUpdate({course_code},req.body);        
        res.status(200).send("the course is updated");
      }catch(err){
        res.status(500).send({err:err})
      }     
})
router.put('/:course_code/enroll', auth, async(req,res)=>{
    const {course_code} = req.params;
    const {email} = req.payload;
    const user = await User.findOne({email});
    const enrollCourse = await Courses.findOne({Code:course_code});
    if(!enrollCourse)
      return res.status(401).send("the course is not found to enroll");
    if(!user)
      return res.status(401).send("the user is not found");
    const {courses} = user;
    const existCourse = courses.find(value=> value.Code === enrollCourse.Code)

    if(existCourse)
        return res.status(201).send(`you have already enroll in ${existCourse.Name} course` )
    try{
        courses.push(enrollCourse);
        await User.findOneAndUpdate({email},{courses});
        res.status(200).send("the course is added");
      }catch(err){
      res.status(500).send(err);
    }
})

router.put('/:course_code/unenroll', auth, async(req,res)=>{
  const {course_code} = req.params;
  const {email} = req.payload;
  const user = await User.findOne({email});
  const unEnrollCourse = await Courses.findOne({Code:course_code});
  if(!unEnrollCourse)  // to check first if the userexist or not
    return res.status(401).send("the course is not found to unenroll");
  if(!user)
    return res.status(401).send("the user is not found");
    let {courses} = user; // as the courses will change when e remove the unenroolcourse
    const alreadyExist = courses.find(value=> value.Code === unEnrollCourse.Code)
    if(!alreadyExist) // to check if the user dose not have this course to remove
      return res.status(201).send(`you are not enrolled in ${unEnrollCourse.Name} course` )
    try{
      courses = courses.filter(value => value.Code !== unEnrollCourse.Code);
      await User.findOneAndUpdate({email},{courses});
      res.status(200).send("Succyssfully unrolled from this course");
    }catch(err){
    res.status(500).send(err);
  }
})

router.delete("/:Course_Code/delete", auth, async (req, res) => {
    const {email} = req.payload;
    const user = await User.findOne({email});
    if(!user.isAdmin)
      return res.status(400).json({msg:"you are not an admin to delete"});
    try {
      const courseToDelete = await Courses.findOne({
        Code: req.params.Course_Code,
      });
      if (!courseToDelete) {
        return res.status(400).send("No Courses with this course code");
      }
      const {Code} = courseToDelete;
      await Courses.deleteOne({Code});
      return res.status(200).send("Course deleted");
    } catch (err) {
      console.log(err);
      return res.status(500).send(err);
    }
  });

router.delete("/delete", auth, async (req, res) => {
    const {email} = req.payload;
    const user = await User.findOne({email});
    if(!user.isAdmin)
      return res.status(400).json({msg:"you are not an admin to delete"});
    try {
      await Courses.deleteMany({});
      return res.status(200).send("All the Courses deleted");
    } catch (err) {
      console.log(err);
      return res.status(500).send(err);
    }
  });

module.exports = router;