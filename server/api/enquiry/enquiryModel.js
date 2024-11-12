
const mongoose = require("mongoose");
const enquirySchema = new mongoose.Schema({
    name : {type:String,default:""},
    email : {type:String,default:""},
    subject : {type:String,default:""},
    message : {type:String,default:""},
    createdAt :{type:Date,default:Date.now()},
    status:{type:Boolean,default:true},
    success:{type:Boolean,default:true}
})
module.exports = new mongoose.model("enquiry",enquirySchema)