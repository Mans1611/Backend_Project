const nodemailer = require('nodemailer');
const mailVerification = async (to,msg)=>{
    const transporter = nodemailer.createTransport({
        host : process.env.HOST,
        port: 587,
        secure:false,
        auth : {
            user:process.env.USER,
            pass:process.env.PASSWORD
        }
    })
    await transporter.sendMail({
        from:process.env.USER,
        to:to,
        subject:'College Verification',
        html:`<a>${msg}</a>`,
         })
}
module.exports = mailVerification;