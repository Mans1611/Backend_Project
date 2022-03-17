
const router = require('express').Router();
const joi = require('joi');
const bcrypt = require('bcrypt');
const mongoose = require('mongoose');
const User = require('../models/Student');
const jwt = require('jsonwebtoken');
const Token = require('../models/Token');
const crypto = require('crypto');
const mailVerification = require('../maller/mailVerification');
const checkValidation = require('../checkValidation');

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
    if (error) 
        return res.status(401).send(checkValidation(error));
      
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
          await new Token ({ 
            _id:id, 
            token : emailToken
          }).save().then(()=>console.log('done'));
          const link = `http://localhost:3000/students/verify/${emailToken}/${id}`;
          await mailVerification(email,link);
          student.save()
          .then(()=>res.status(200).header("x-auth-token",token).json({msg:"User Created Succussfully"}))
          .catch(err=>res.status(401).send({msg:err}));
    }   
})
router.get('/verify/:token/:id',async (req,res)=>{
  const {token,id} = req.params;
  const tokenFromDB = await Token.findOne({token});
  if(!tokenFromDB)
    return res.status(404).json({err:'token do not found'});
  try{
  await User.findByIdAndUpdate(id,{verified:true});
  await Token.findOneAndDelete({token});
  res.status(200).send("verifeid");
  }catch(err){
    res.status(401).send(err);
  }
});
const signInValidation = joi.object({
  email: joi.string().email().required(),
  password : joi.string().required()
})

router.post('/login',async(req,res)=>{
  const {error} = signInValidation.validate(req.body,{abortEarly:false});
  if (error) 
    return res.status(401).send(checkValidation(error));

  try{
    const {email,password} = req.body;
    const studnt = await User.findOne({email});
    const checkPass = await bcrypt.compare(password,studnt.password);
    if(studnt && checkPass)
      return res.status(201).send("your login success");
    res.status(404).send('Invalid email or password');
  }catch(err){
    res.status(401).json({error:err});
  }
})

module.exports = router;