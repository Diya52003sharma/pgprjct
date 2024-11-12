const mongoose = require("mongoose");
const userSchema = new mongoose.Schema({
    name : {type:String,default:""},
    email : {type:String,default:""},
    password : {type:String,default:""},
    pgOwnerId:{type:mongoose.Schema.Types.ObjectId,ref:"pgowner"},
    userType:{type:Number,default:2}, //1->Admin,2->pg owner,3->seeker
    createdAt :{type:Date,default:Date.now()},
    status:{type:Boolean,default:true}
})
module.exports = new mongoose.model("users",userSchema)