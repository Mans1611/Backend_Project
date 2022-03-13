
const router = require('express').Router();
const joi = require('joi');
const bcrypt = require('bcrypt');
const mongoose = require('mongoose');
const Student = require('../models/Student');
const jwt = require('jsonwebtoken');


const signUpValidation = joi.object({
    fullName : joi.string().required().min(4).max(16),
    email: joi.string().email().required(),
    password : joi.string().required().min(8).max(16),
    gender : joi.string().required(),
    grade : joi.number().min(0).max(100).required(),
    schoolName : joi.string().min(3).max(25).required(),
    graduationYear : joi.number().min(2015).max(2021).required(),
})

router.post('/register',async (req,res)=>{
    const {error} = signUpValidation.validate(req.body,{abortEarly:false}); 
    if (error) {
        const errorObject = {};
        error.details.forEach((err) => {
          errorObject[err.path[0]] = err.message;
        });
        console.log(errorObject);
        return res.status(416).send(errorObject);
      }
    const {fullName,email,password,gender,grade,schoolName,graduationYear} = req.body;
    const existStudent = await Student.findOne({email});
    if(existStudent)
      return res.status(402).send('this student is exist you can login');
    else{
          const salt = await  bcrypt.genSalt(10);
          const hashed = await bcrypt.hash(password,salt);
          const token = jwt.sign({email,fullName},process.env.PK);
          console.log(token);
          const student = await new Student({
            fullName,
            email,
            password : hashed,
            gender,
            grade ,
            schoolName ,
            graduationYear
          });
          student.save()
          .then(()=>res.status(200).json({msg:"User Created Succussfully"}))
          .catch(err=>res.status(401).send({msg:err}))
      
    }  
})


module.exports = router ; 