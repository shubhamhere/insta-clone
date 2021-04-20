const jwt = require('jsonwebtoken')
const {JWT_SECRET} = require('../config/keys')
const mongoose = require('mongoose')
const User = mongoose.model("User")
module.exports = (req,res,next)=>{
    const {authorization} = req.headers
    //authorization === Bearer tokencode (we will send authorization in this format)
    if(!authorization){
       return res.status(401).json({error:"you must be logged in"})
    }
    const token = authorization.replace("Bearer ","")
    jwt.verify(token,JWT_SECRET,(err,payload)=>{
        if(err){
         return   res.status(401).json({error:"you must be logged in"})
        }

        const {_id} = payload //destructuring _id from auth.js
        User.findById(_id).then(userdata=>{
            req.user = userdata  //we can acess all details in req.user
            next()  
        })
        
        
    })
}