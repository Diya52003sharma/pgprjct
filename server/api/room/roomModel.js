
const mongoose = require("mongoose");
const roomSchema = new mongoose.Schema({
    Name : {type:String,default:""},
    Image : {type:String,default:"noImage.jpg"},
    rent : {type:String,default:""},
    categoryId : {type:mongoose.Schema.Types.ObjectId,ref:"categories"},
    pgownerId :  {type:mongoose.Schema.Types.ObjectId,ref:"users"},
    description : {type:String,default:""},
    createdAt :{type:Date,default:Date.now()},
    status:{type:Boolean,default:true},
    success:{type:Boolean,default:true}
})
module.exports = new mongoose.model("room",roomSchema)