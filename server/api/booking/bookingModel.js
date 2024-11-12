
const mongoose = require("mongoose");
const bookingSchema = new mongoose.Schema({
    pgowner_id : {type:mongoose.Schema.Types.ObjectId,ref:"users"},
    room_id : {type:mongoose.Schema.Types.ObjectId,ref:"room"},
    customer_id : {type:mongoose.Schema.Types.ObjectId,ref:"users"},
    date : {type:Date,default:""},
    message : {type:String,default:""},
    createdAt :{type:Date,default:Date.now()},
    status:{type:String,default:"Pending"}
})
module.exports = new mongoose.model("booking",bookingSchema)    