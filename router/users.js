const router = require('express').Router();
const User = require('../models/Student');
const auth = require('../middleware/auth');
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
module.exports = router;

