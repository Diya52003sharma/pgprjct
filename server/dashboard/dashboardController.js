
const Rooms =  require("../api/room/roomModel")
const Booking = require("../api/booking/bookingModel")
const User = require("../api/user/userModel")
dashboard =async(req,res)=>{
    let totalRooms =await Rooms.countDocuments({status:"true" || {pgowner_id:req.body._id}});
    let totalInactiveRooms =await Rooms.countDocuments({status:"false"});
    let totalBooking = await Booking.countDocuments({pgowner_id:req.body._id});
    let totalUser = await User.countDocuments({status:"true"});
    res.send({
        message:"dashboard loaded ",
        success:true,
        status:200,
        totalRooms:totalRooms,
        totalInactiveRooms:totalInactiveRooms,
        totalBooking:totalBooking,
        totalUser:totalUser
    })
}

module.exports = {dashboard}