const router = require('express').Router();
const joi = require('joi');
const jwt = require('json-web-token');
const { resetWatchers } = require('nodemon/lib/monitor/watch');
const User = require('../models/Student');
const Coures = require('../models/CourseSchema');
const auth = require('../middleware/auth');
const { modelName } = require('../models/Student');

router.get("/", async (req, res) => { // check requiurement
    try {
      const courses = await Coures.find({});
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
    if (error) {
        const errorObject = {};
        error.details.forEach((err) => {
          errorObject[err.path[0]] = err.message;
        });
        console.log(errorObject);
        return res.status(416).send(errorObject);
      }
      try{
          const {email} = req.payload; 
          //console.log(req.payload.email);
          const user = await User.findOne({email});
          console.log(req.body);
        if(!user.isAdmin)
            return res.status(401).json({msg : "you are not admin"});
        await new Coures(req.body).save()
        .then(()=>console.log("course is added"))
        .catch((err)=>res.status(404).send(err));
        res.status(200).json({msg:"course is add succussfully"});    
      }catch(err){
          res.status(500).send("there is an error in adding courses");
      }  
})
router.put('/course')



router.delete("/:Course_Code/delete", async (req, res) => {
    try {
      const courseToDelete = await Coures.findOne({
        Code: req.params.Course_Code,
      });
      //console.log(courseToDelete);
      if (!courseToDelete) {
        console.log("No Courses to delete");
        return res.status(400).send("No Courses with this course code");
      }
      const {Code} = courseToDelete;
      await Coures.deleteOne({Code});
      return res.status(200).send("Course deleted");
    } catch (err) {
      console.log(err);
      return res.status(500).send(err);
    }
  });
module.exports = router;