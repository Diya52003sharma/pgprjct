
const mongoose = require("mongoose");
const categorySchema = new mongoose.Schema({
    categoryName : {type:String,default:""},
    categoryImage : {type:String,default:""},
    description : {type:String,default:""},
    createdAt :{type:Date,default:Date.now()},
    status:{type:Boolean,default:true}
})
module.exports = new mongoose.model("categories",categorySchema)