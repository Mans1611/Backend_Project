const { default: mongoose } = require('mongoose');
const {Schema,model} = require('mongoose');

const token = new Schema({
    token :{
        user_id : mongoose.Types.ObjectId,
        type:String,
        required : true
    } 
})

const tokenModel = model('tokenModel',token);
module.exports = tokenModel;