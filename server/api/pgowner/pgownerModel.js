const mongoose =require("mongoose");
const pgownerSchema =new mongoose.Schema({
    pgName:{type:String,default:""},
    name:{type:String,default:""},
    email:{type:String,default:""},
    address:{type:String,default:""},
    location:{type:String,default:""},
    description:{type:String,default:""},
    contact:{type:String,default:""},
    userId:{type:mongoose.Schema.Types.ObjectId,ref:"User"},
    createdAt:{type:Date,default:Date.now()},
    status:{type:Boolean,default:true},


})
module.exports = new mongoose.model("pgowner",pgownerSchema)