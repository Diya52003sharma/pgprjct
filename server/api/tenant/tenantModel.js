const mongoose =require("mongoose");
const tenantSchema =new mongoose.Schema({
    name:{type:String,default:""},
    email:{type:String,default:""},
    address:{type:String,default:""},
 
    contact:{type:String,default:""},
    userId:{type:mongoose.Schema.Types.ObjectId,ref:"User"},
    createdAt:{type:Date,default:Date.now()},
    status:{type:Boolean,default:true},


})
module.exports = new mongoose.model("tenant",tenantSchema)