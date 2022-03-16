const router = require('express').Router();
const User = require('../models/Student');
const auth = require('../middleware/auth');
const joi = require('joi');
router.get('/:id',auth,async(req,res)=>{
    try{
        const {id} = req.params;
        console.log(id);
        const user = await User.findById(id);
        if(user && (user.email === req.payload.email))
            return res.status(201).json({user});
        }catch(error){
            res.status(400).send(error);
        }
})
const updateValidation = joi.object({
    fullName : joi.string().min(4).max(16),
    email: joi.string().email(),
    password : joi.string().min(8).max(16),
    birthDate: joi.date(),
    gender : joi.string(),
    grade : joi.number().min(0).max(100),
    schoolName : joi.string().min(3).max(25),
    graduationYear : joi.number().min(2015).max(2021),
}) // here every feild is not required to update 


router.put('/:id',auth,async(req,res)=>{
    const {error} = updateValidation.validate(req.body,{abortEarly:false})
    if (error) {
        const errorObject = {};
        error.details.forEach((err) => {
          errorObject[err.path[0]] = err.message;
        });
        console.log(errorObject);
        return res.status(416).send(errorObject);
      }
    
    const {id} = req.params;
    try{
        const user = await User.findById(id);
        if(user &&(user.email === req.payload.email)){
            await User.findByIdAndUpdate(id,req.body);
        return res.status(200).send("the user is updated");
        }else{
            return res.status(403).send("bad request");
        }
    }catch(err){
        res.status(402).send(err);
    }
})
module.exports = router;

