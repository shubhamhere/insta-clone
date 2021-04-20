const mongoose = require('mongoose')
const {ObjectId} = mongoose.Schema.Types
const postSchema = new mongoose.Schema({
    title:{
        type:String,
        required:true
    },
    body:{
        type:String,
        required:true
    },
    photo:{
        type:String,
        required:true
    },
    likes:[{type:ObjectId,ref:"User"}],
    comments:[{
        text:String,
        postedBy:{type:ObjectId,ref:"User"} //it will refer to user
    }],
    postedBy:{
       type:ObjectId,
       ref:"User"
    }
},{timestamps:true})//for showing new posts sorted

mongoose.model("Post",postSchema)