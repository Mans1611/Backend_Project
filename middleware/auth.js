const jwt = require('jsonwebtoken');

const auth = (req,res,next) =>{
    const token = req.header('x-auth-token');
    if(!token)
        return res.status(400).send("The Token is not found");
    try{
        const payload = jwt.verify(token,process.env.PK);
        req.payload = payload;
        next();
    }catch(err){
        res.status(402).send(err);
        next();
    }

}

module.exports = auth; 