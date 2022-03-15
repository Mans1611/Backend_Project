
const router = require('express').Router();
const joi = require('joi');
const bcrypt = require('bcrypt');
const mongoose = require('mongoose');
const User = require('../models/Student');
const jwt = require('jsonwebtoken');
const Token = require('../models/Token');
const crypto = require('crypto');
const mailVerification = require('../maller/mailVerification');


const signUpValidation = joi.object({
    fullName : joi.string().required().min(4).max(16),
    email: joi.string().email().required(),
    password : joi.string().required().min(8).max(16),
    birthDate: joi.date().required(),
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
    const {fullName,email,password,birthDate,gender,grade,schoolName,graduationYear} = req.body;
    const existStudent = await User.findOne({email});
    if(existStudent)
      return res.status(402).send('this student is exist you can login');
    else{
          const salt = await  bcrypt.genSalt(10);
          const hashed = await bcrypt.hash(password,salt);
          const token = jwt.sign({email,fullName},process.env.PK);
          console.log(token);
          let date = birthDate.toString();
          date = date.split(' ')[0]; // to trim the time from the date
          
          const student = await new User({
            fullName,
            email,
            password : hashed,
            birthDate:date,
            gender,
            grade ,
            schoolName ,
            graduationYear,
          
          });
          const emailToken = crypto.randomBytes(32).toString('hex');
          const {id} = student;
          console.log(id);
          await new Token ({ 
            _id:id, 
            token : emailToken
          }).save().then(()=>console.log('done'));
          const link = `http://localhost:3000/students/verify/${emailToken}`;
          await mailVerification(email,link);
          student.save()
          .then(()=>res.status(200).json({msg:"User Created Succussfully"}))
          .catch(err=>res.status(401).send({msg:err}));
    }   
})
router.get('/students/verify/:token',async (req,res)=>{
  const {token} = req.params;
  const tokenFromDB = await Token.findOne({token});
  console.log("passed");
  console.log(tokenFromDB);
  if(!tokenFromDB)
    return res.status(404).json({err:'token do not found'});
  try{

  
  await User.findByIdAndUpdate(tokenFromDB._id,{verified:true});
  await Token.findOneAndDelete({token});
  res.status(200).send("verifeid");
  }catch(err){
    res.status(401).send(err);
  }
});

module.exports = router ; 